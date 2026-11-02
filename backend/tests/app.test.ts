import request from "supertest";
import { app } from "../src/app";

describe("health endpoint", () => {
  it("reports that the API is available", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
