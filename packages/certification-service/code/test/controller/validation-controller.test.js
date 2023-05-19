const fs = require("fs");
const path = require("path");
const os = require("os");
const { setUpHttpServer } = require("../setup");
const validationController = require("../../src/controllers/validation-controller");
const {
  VALIDATION_TYPE_DESIGN,
  VALIDATION_TYPE_DOCUMENTATION,
  VALIDATION_TYPE_SECURITY,
  VALIDATION_TYPE_OVERALL_SCORE,
} = require("../../src/verify/types");
const { uuid } = require("../../src/utils/uuid");

jest.mock("../../src/verify/lint", () => {
  const originalModule = jest.requireActual("../../src/verify/lint");
  let result = [
    {
      code: "global-doc",
      message: "Definition `doc` must be present and non-empty string in all types",
      path: [],
      severity: 1,
      source: "/tmp/upload_f09caba7503674b723fbd714a4f28564.yml",
      range: {
        start: {
          line: 0,
          character: 0,
        },
        end: {
          line: 826,
          character: 82,
        },
      },
    },
  ];
  return {
    __esModule: true,
    ...originalModule,
    lintFileWithSpectral: () => result,
  };
});

let port = 0;
let server = null;

describe("Tests Validation Controller", () => {
  beforeAll(async () => {
    server = await setUpHttpServer();
    port = server.address().port;
  });

  afterAll(() => {
    server.close();
  });

  test("validate REPOSITORY OK", async () => {
    const ctx = {
      request: {
        body: {
          url: `http://localhost:${port}/data/example-rest.zip`,
          validationType: VALIDATION_TYPE_OVERALL_SCORE,
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    await validationController.validate(ctx, next);
    expect(ctx.status).toBe(200);
  });
  test("validate  REPOSITORY OK", async () => {
    const ctx = {
      request: {
        body: {
          url: `http://localhost:${port}/data/example-rest.zip`,
          validationType: VALIDATION_TYPE_OVERALL_SCORE,
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    await validationController.validate(ctx, next);

    expect(ctx.status).toBe(200);
  });
  test("validate REPOSITORY v3 OK", async () => {
    const repository = "apiraptor";
    const ctx = {
      request: {
        body: {
          url: `http://localhost:${port}/data/documentation-v3.zip`,
          validationType: VALIDATION_TYPE_OVERALL_SCORE,
          key: `${repository.toUpperCase()}`,
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    await validationController.validate(ctx, next);
    expect(ctx.status).toBe(200);
  });

  test("validate LINTER Zip file OK", async () => {
    const tmpFile = path.join(os.tmpdir(), Date.now() + "-repo.zip");
    fs.copyFileSync(`${__dirname}/../data/example-rest-pipe.zip`, tmpFile);
    const ctx = {
      request: {
        files: {
          url: {
            filepath: tmpFile,
            originalFilename: "repo_example_2",
            mimetype: "application/zip",
          },
        },
        body: {
          validationType: VALIDATION_TYPE_DESIGN,
          apiProtocol: "REST",
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    await validationController.validate(ctx, next);

    expect(ctx.status).toBe(200);
  });

  test("validate LINTER Zip OK", async () => {
    const tmpFile = path.join(os.tmpdir(), Date.now() + "-repo.zip");
    fs.copyFileSync(`${__dirname}/../data/example-rest-pipe.zip`, tmpFile);
    const ctx = {
      request: {
        files: {
          url: {
            filepath: tmpFile,
            originalFilename: "repo_example_1",
            mimetype: "application/zip",
          },
        },
        body: {
          validationType: VALIDATION_TYPE_DESIGN,
          apiProtocol: "EVENT",
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    await validationController.validate(ctx, next);

    expect(ctx.status).toBe(200);
  });

  test("validate SECURITY Zip OK", async () => {
    const tmpFile = path.join(os.tmpdir(), Date.now() + "-repo.zip");
    fs.copyFileSync(`${__dirname}/../data/example-rest-pipe.zip`, tmpFile);
    const ctx = {
      request: {
        files: {
          url: {
            filepath: tmpFile,
            originalFilename: "repo_example_3",
            mimetype: "application/zip",
          },
        },
        body: {
          validationType: VALIDATION_TYPE_SECURITY,
          apiProtocol: "REST",
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    await validationController.validate(ctx, next);

    expect(ctx.status).toBe(200);
  });

  test("validate DOCUMENTATION Zip v3 OK", async () => {
    const tmpFile = path.join(os.tmpdir(), Date.now() + "-repo.zip");
    fs.copyFileSync(`${__dirname}/../data/documentation-v3.zip`, tmpFile);
    const ctx = {
      request: {
        files: {
          url: {
            filepath: tmpFile,
            originalFilename: "repo_example",
            mimetype: "application/zip",
          },
        },
        body: {
          validationType: VALIDATION_TYPE_DOCUMENTATION,
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    await validationController.validate(ctx, next);
    expect(ctx.status).toBe(200);
  });

  test("validate EVENT LINTER Zip OK", async () => {
    const tmpFile = path.join(os.tmpdir(), Date.now() + "-repo.zip");
    fs.copyFileSync(`${__dirname}/../data/example-grpc-event.zip`, tmpFile);
    const ctx = {
      request: {
        files: {
          url: {
            filepath: tmpFile,
            originalFilename: "repo_event",
            mimetype: "application/zip",
          },
        },
        body: {
          validationType: VALIDATION_TYPE_DESIGN,
          apiProtocol: "EVENT",
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    await validationController.validate(ctx, next);
    expect(ctx.status).toBe(200);
  });

  test("validate GRPC Zip file OK", async () => {
    const tmpFile = path.join(os.tmpdir(), Date.now() + "-repo.zip");
    fs.copyFileSync(`${__dirname}/../data/example-grpc-event.zip`, tmpFile);
    const ctx = {
      request: {
        files: {
          url: {
            filepath: tmpFile,
            originalFilename: "repogrpc",
            mimetype: "application/zip",
          },
        },
        body: {
          validationType: VALIDATION_TYPE_DESIGN,
          apiProtocol: "GRPC",
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    await validationController.validate(ctx, next);

    expect(ctx.status).toBe(200);
  });

  test("validate remote file OK", async () => {
    const ctx = {
      request: {
        body: {
          url: `http://localhost:${port}/data/openapi-rest2.yml`,
          apiProtocol: 1,
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    await validationController.validateFile(ctx, next);

    expect(ctx.status).toBe(200);
  });

  test("validate local file OK", async () => {
    const tmpFile = path.join(os.tmpdir(), Date.now() + "-file.yaml");
    fs.copyFileSync(`${__dirname}/../data/openapi-rest2.yml`, tmpFile);
    const ctx = {
      request: {
        files: {
          url: {
            filepath: tmpFile,
            originalFilename: "openapi-rest2.yml",
            mimetype: "text/yaml",
          },
        },
        body: {
          apiProtocol: 1,
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    await validationController.validateFile(ctx, next);

    expect(ctx.status).toBe(200);
  });

  test("validate grpc file OK", async () => {
    const tmpFile = path.join(os.tmpdir(), uuid());
    fs.copyFileSync(`${__dirname}/../data/product_service.proto`, tmpFile);
    const ctx = {
      request: {
        files: {
          url: {
            filepath: tmpFile,
            originalFilename: "product_service.proto",
            mimetype: "application/octet-stream",
          },
        },
        body: {
          apiProtocol: 3,
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    await validationController.validateFile(ctx, next);

    expect(ctx.status).toBe(200);
  });

  test("validate local file KO, no protocol", async () => {
    const tmpFile = path.join(os.tmpdir(), Date.now() + "-file.yaml");
    fs.copyFileSync(`${__dirname}/../data/openapi-rest2.yml`, tmpFile);
    const ctx = {
      request: {
        files: {
          url: {
            filepath: tmpFile,
            originalFilename: "openapi-rest2.yml",
            mimetype: "text/yaml",
          },
        },
        body: {},
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    try {
      await validationController.validateFile(ctx, next);
    } catch (e) {
      expect(e.status).toBe(400);
    }
  });

  test("validate local file KO, invalid protocol", async () => {
    const tmpFile = path.join(os.tmpdir(), Date.now() + "-file.yaml");
    fs.copyFileSync(`${__dirname}/../data/openapi-rest2.yml`, tmpFile);
    const ctx = {
      request: {
        files: {
          url: {
            filepath: tmpFile,
            originalFilename: "openapi-rest2.yml",
            mimetype: "text/yaml",
          },
        },
        body: {
          apiProtocol: "INVALID",
        },
      },
      response: {},
      state: {},
    };
    let next = jest.fn();
    try {
      await validationController.validateFile(ctx, next);
    } catch (e) {
      expect(e.status).toBe(400);
    }
  });

  test("validate local markdown file NOK", async () => {
    const tmpFile = path.join(os.tmpdir(), Date.now() + "-file.yaml");
    fs.copyFileSync(`${__dirname}/../data/README.md`, tmpFile);
    const ctx = {
      request: {
        files: {
          url: {
            filepath: tmpFile,
            originalFilename: "README.md",
            mimetype: "text/plain",
          },
        },
        body: {},
      },
      response: {},
      state: {},
    };
    let next = jest.fn();

    try {
      await validationController.validateFile(ctx, next);
    } catch (e) {
      expect(e.status).toBe(400);
    }
  });
});
