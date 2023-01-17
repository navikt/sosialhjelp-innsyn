import {server} from "./mocks/server";
import {queryClient} from "./test/test-utils";
import "@testing-library/jest-dom";

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    server.resetHandlers();
});

// Clean up after the tests are finished.
afterAll(async () => {
    await queryClient.cancelQueries();
    server.close();
});
