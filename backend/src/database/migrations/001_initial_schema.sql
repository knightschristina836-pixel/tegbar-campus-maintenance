CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('STUDENT', 'PROCTOR', 'TECHNICIAN', 'ADMIN');
CREATE TYPE report_status AS ENUM (
  'PENDING',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'VERIFIED',
  'REJECTED'
);
CREATE TYPE report_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE schedule_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

CREATE TABLE campuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'STUDENT',
  student_id TEXT UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_role_identity_check CHECK (
    (role <> 'STUDENT') OR student_id IS NOT NULL
  )
);
CREATE INDEX users_role_active_idx ON users (role, is_active);

CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campus_id, id),
  UNIQUE (campus_id, code)
);

CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE RESTRICT,
  building_id UUID,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campus_id, id),
  UNIQUE (campus_id, code),
  FOREIGN KEY (campus_id, building_id)
    REFERENCES buildings(campus_id, id) ON DELETE RESTRICT
);
CREATE INDEX blocks_building_idx ON blocks (building_id);

CREATE TABLE floors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  floor_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (block_id, floor_number),
  UNIQUE (block_id, id)
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_id UUID NOT NULL REFERENCES floors(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  room_number TEXT NOT NULL,
  qr_code TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(18), 'hex'),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (floor_id, room_number)
);
CREATE INDEX rooms_floor_idx ON rooms (floor_id);

CREATE TABLE maintenance_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE maintenance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  category_id UUID NOT NULL REFERENCES maintenance_categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status report_status NOT NULL DEFAULT 'PENDING',
  priority report_priority NOT NULL DEFAULT 'MEDIUM',
  affected_users_count INTEGER NOT NULL DEFAULT 1 CHECK (affected_users_count > 0),
  escalation_level SMALLINT NOT NULL DEFAULT 0 CHECK (escalation_level >= 0),
  resolved_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX reports_reporter_created_idx ON maintenance_reports (reporter_id, created_at DESC);
CREATE INDEX reports_status_priority_created_idx
  ON maintenance_reports (status, priority, created_at DESC);
CREATE INDEX reports_room_created_idx ON maintenance_reports (room_id, created_at DESC);
CREATE INDEX reports_category_idx ON maintenance_reports (category_id);

CREATE TABLE report_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES maintenance_reports(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL CHECK (file_size_bytes > 0),
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX report_images_report_idx ON report_images (report_id);

CREATE TABLE complaint_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES maintenance_reports(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  assigned_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unassigned_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT assignment_unassigned_after_assigned
    CHECK (unassigned_at IS NULL OR unassigned_at >= assigned_at)
);
CREATE UNIQUE INDEX one_active_assignment_per_report_idx
  ON complaint_assignments (report_id) WHERE unassigned_at IS NULL;
CREATE INDEX assignments_technician_active_idx
  ON complaint_assignments (technician_id, assigned_at DESC) WHERE unassigned_at IS NULL;

CREATE TABLE complaint_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES maintenance_reports(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  previous_status report_status,
  new_status report_status NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX status_history_report_created_idx
  ON complaint_status_history (report_id, created_at DESC);

CREATE TABLE duplicate_complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_report_id UUID NOT NULL REFERENCES maintenance_reports(id) ON DELETE CASCADE,
  duplicate_report_id UUID NOT NULL REFERENCES maintenance_reports(id) ON DELETE CASCADE,
  linked_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT duplicate_reports_not_self CHECK (primary_report_id <> duplicate_report_id),
  UNIQUE (primary_report_id, duplicate_report_id),
  UNIQUE (duplicate_report_id)
);
CREATE INDEX duplicate_primary_report_idx ON duplicate_complaints (primary_report_id);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES maintenance_reports(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX notifications_user_unread_created_idx
  ON notifications (user_id, created_at DESC) WHERE read_at IS NULL;

CREATE TABLE maintenance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE RESTRICT,
  room_id UUID REFERENCES rooms(id) ON DELETE RESTRICT,
  category_id UUID REFERENCES maintenance_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  status schedule_status NOT NULL DEFAULT 'SCHEDULED',
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ends_at IS NULL OR ends_at >= starts_at)
);
CREATE INDEX schedules_campus_starts_idx ON maintenance_schedules (campus_id, starts_at);
CREATE INDEX schedules_room_starts_idx ON maintenance_schedules (room_id, starts_at);

CREATE TABLE building_notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE RESTRICT,
  building_id UUID,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  published_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (campus_id, building_id)
    REFERENCES buildings(campus_id, id) ON DELETE RESTRICT,
  CHECK (expires_at IS NULL OR published_at IS NULL OR expires_at >= published_at)
);
CREATE INDEX notices_campus_published_idx ON building_notices (campus_id, published_at DESC);
CREATE INDEX notices_building_idx ON building_notices (building_id);

CREATE TABLE repair_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES maintenance_reports(id) ON DELETE CASCADE,
  verified_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  is_repaired BOOLEAN NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX repair_verifications_report_created_idx
  ON repair_verifications (report_id, created_at DESC);

CREATE TABLE technician_work_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES maintenance_reports(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  work_started_at TIMESTAMPTZ,
  work_ended_at TIMESTAMPTZ,
  description TEXT NOT NULL,
  materials_used TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (work_ended_at IS NULL OR (work_started_at IS NOT NULL AND work_ended_at >= work_started_at))
);
CREATE INDEX work_records_report_created_idx
  ON technician_work_records (report_id, created_at DESC);
CREATE INDEX work_records_technician_created_idx
  ON technician_work_records (technician_id, created_at DESC);

INSERT INTO campuses (name, code)
VALUES ('Hawassa University Institute of Technology Campus', 'HU-IOT')
ON CONFLICT (code) DO NOTHING;
