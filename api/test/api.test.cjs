const supertest = require("supertest");
const { describe, it, before } = require("mocha");

let chai;

(async () => {
  chai = await import("chai");
})();

const config = {
  assertionFormat: "chai",
  request: {
    baseURL: "http://localhost:3001",
    headers: {},
  },
};

let token;

before(async () => {
  const response = await supertest(config.request.baseURL)
    .post("/api/login")
    .send({
      email: "ale@ale.com",
      password: "ale",
    });

  token = response.body.token;
  if (!token) {
    throw new Error("Failed to fetch auth token. Check login credentials.");
  }

  config.request.headers.Authorization = `Bearer ${token}`;
});

describe("Manual API Tests", () => {
  it("/api/developer/allClients => should fetch all clients", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/developer/allClients")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/developer/allDevelopers => should fetch all developers", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/developer/allDevelopers")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/developer/project/{projectId} => should fetch developers for a specific project", async () => {
    const projectId = 5;
    const response = await supertest(config.request.baseURL)
      .get(`/api/developer/project/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/developer/assignProject => should assign a developer to a project", async () => {
    const requestBody = {
      projectId: 2,
      developerId: 8,
    };
    const response = await supertest(config.request.baseURL)
      .post("/api/developer/assignProject")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/developer/{developerId}/project/{projectId} => should remove a developer from a project", async () => {
    const developerId = "8";
    const projectId = "2";
    const response = await supertest(config.request.baseURL)
      .delete(`/api/developer/${developerId}/project/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/login => should return 200 for valid login", async () => {
    const response = await supertest(config.request.baseURL)
      .post("/api/login")
      .send({
        email: "ale@ale.com",
        password: "ale",
      });
    chai.expect(response.status).to.equal(200);
    chai.expect(response.body.success).to.equal(true);
  });

  it("/api/users => should fetch all users", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/users/{id} => should fetch a specific user by ID", async () => {
    const userId = "8";
    const response = await supertest(config.request.baseURL)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/projects => should fetch all projects", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/projects/{id} => should fetch a specific project by ID", async () => {
    const projectId = "2";
    const response = await supertest(config.request.baseURL)
      .get(`/api/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/projects/create => should create a new project", async () => {
    const requestBody = {
      title: "New Project tester",
      description: "Project description",
      budget: "15000",
    };
    const response = await supertest(config.request.baseURL)
      .post("/api/projects/create")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);
    chai.expect(response.status).to.equal(201);
  });

  it("/api/user => should fetch an user email and role based only in the token", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/user")
      .send({ token })
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    chai.expect(response.status).to.equal(200);
  });

  // it("/api/chat/send => should send a chat message", async () => {
  //   const requestBody = {
  //     conversationId: 3,
  //     senderId: 8,
  //     receiverId: 9,
  //     message: "This is a test message",
  //   };

  //   const response = await supertest(config.request.baseURL)
  //     .post("/api/chat/send")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send(requestBody);

  //   chai.expect(response.status).to.equal(200);
  // });

  it("/api/chat/history/8/9 => should fetch chat history", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/chat/history/8/9")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/projects/client/8 => should fetch all projects of a client", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/projects/client/8")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/projects/8/invoice => should generate an invoice", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/projects/8/invoice")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/developer/getAllProjectsFromDeveloper/8 => returns all projects from a developer", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/developer/getAllProjectsFromDeveloper/8")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/projects/2 => updates a project", async () => {
    const requestBody = {
      title: "Project tester modificated",
      description: "Project description modificated",
      budget: "20000",
    };

    const response = await supertest(config.request.baseURL)
      .post("/api/projects/2")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    chai.expect(response.status).to.equal(200);
  });

  it("/api/events/6 => returns all events from a userId", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/events/6")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/events/ => should create a new event from a userId in the request", async () => {
    const requestBody = {
      id: "2024-11-20T23:00:00.000Z12345",
      title: "test from mocha tester",
      start: "2024-11-20T23:00:00.000Z",
      end: "2024-11-20T23:00:00.000Z",
      allDay: true,
      userId: 6,
    };
    const response = await supertest(config.request.baseURL)
      .post("/api/events/")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);
    chai.expect(response.status).to.equal(201);
  });

  it("/api/developer/5/AllClients => returns all clients assigned to developer", async () => {
    const response = await supertest(config.request.baseURL).get(
      "/api/developer/5/AllClients"
    );
    chai.expect(response.status).to.equal(200);
  });

  it("/api/developer/5/client/8 => add relation developer - client ", async () => {
    const response = await supertest(config.request.baseURL).post(
      "/api/developer/5/client/8"
    );
    chai.expect(response.status).to.equal(201);
  });
  it("/api/developer/5/client/8 => delete relation developer - client ", async () => {
    const response = await supertest(config.request.baseURL).delete(
      "/api/developer/5/client/8"
    );
    chai.expect(response.status).to.equal(200);
  });

  //  it("/api/projects/{id} (DELETE) => should delete a project by ID", async () => {
  //   const projectId = "7";
  //   const response = await supertest(config.request.baseURL)
  //     .delete(`/api/projects/${projectId}`)
  //     .set("Authorization", `Bearer ${token}`);
  //   chai.expect(response.status).to.equal(200);
  // });

  // it("/api/events/{eventId} (DELETE) => should delete an event by ID", async () => {
  //   const eventId = "2";
  //   const response = await supertest(config.request.baseURL).delete(
  //     `/api/events/${eventId}`
  //   );
  //   chai.expect(response.status).to.equal(200);
  // });
  it("/api/users => create a new user", async () => {
    const requestBody = {
      name: "John43454",
      email: "johnd345oe3@example.com",
      password: "securepassword1234",
      phone: "123456789034",
      roleName: "Client",
    };
    const response = await supertest(config.request.baseURL)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);
    chai.expect(response.status).to.equal(201);
  });
});
