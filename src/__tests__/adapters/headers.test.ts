import adaptHeaders from "../../adapters/headers";

describe("adapters/headers: ", () => {
  describe("adaptHeaders(): ", () => {
    it("returns flattened object in case if headers are array of key-value pairs.", () => {
      const headers = [
        {
          key: "mock-key-1",
          value: "mock-value-1",
        },
        {
          key: "mock-key-2",
          value: "mock-value-2",
        },
      ];

      const expectedResult = {
        [headers[0].key]: headers[0].value,
        [headers[1].key]: headers[1].value,
      };
      const result = adaptHeaders(headers);

      expect(result).toEqual(expectedResult);
    });

    it("returns same headers object if its just `key - value`.", () => {
      const headers = {
        mockKey: "mock-value",
      };

      const result = adaptHeaders(headers);

      expect(result).toEqual(headers);
    });

    it("flattens headers object if its `key - { prepared, value }` pair.", () => {
      const headers = {
        mockKey: {
          prepared: true,
          value: "mock-value",
        },
      };

      const expectedResult = {
        mockKey: headers.mockKey.value,
      };
      const result = adaptHeaders(headers);

      expect(result).toEqual(expectedResult);
    });

    it("flattens headers object if its `key - Array<values>` pair.", () => {
      const headers = {
        mockKey: ["mock-value-1", "mock-value-2"],
      };

      const expectedResult = {
        mockKey: headers.mockKey[0],
      };
      const result = adaptHeaders(headers);

      expect(result).toEqual(expectedResult);
    });
  });
});
