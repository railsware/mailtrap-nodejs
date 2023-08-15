import { Readable } from "stream";
import fs from "node:fs";

import adaptContent from "../../adapters/content";

jest.mock("node:fs");

describe("adapters/content: ", () => {
  describe("adaptContent(): ", () => {
    it("returns content if type is string", () => {
      const content = "mock-content";

      const result = adaptContent(content);

      expect(result).toBe(content);
    });

    it("returns content if it is instance of buffer", () => {
      const content = Buffer.from("mock-content");

      const result = adaptContent(content);

      expect(result).toBe(content);
    });

    it("checks if read method has been called if content is readable.", () => {
      const content = "mock-content";
      const readableStream = new Readable({
        read() {
          this.push(content);
          this.push(null);
        },
      });

      const result = adaptContent(readableStream);

      expect(result.toString()).toEqual(content);
    });

    it("recursively checks the content if content has content property.", () => {
      const content = {
        content: "mock-content",
      };

      const result = adaptContent(content);

      expect(result).toBe(content.content);
    });

    it("reads file in case if content is file and has path.", () => {
      const content = {
        path: "mock-path",
      };

      adaptContent(content);

      expect(fs.readFileSync).toBeCalledTimes(1);
      expect(fs.readFileSync).toBeCalledWith(content.path);
    });
  });
});
