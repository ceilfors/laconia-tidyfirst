const spy = require("../src/spy");

describe("spy", () => {
  let lc;
  let lower;
  let spierFactory;
  let spier;

  beforeEach(() => {
    lower = jest.fn().mockResolvedValue("result");
    spier = { track: jest.fn() };
    spierFactory = { makeSpy: jest.fn().mockReturnValue(spier) };
    lc = { event: "event", $spierFactory: spierFactory };
  });

  it("should call the lower order function", async () => {
    spy(lower)(lc);
    expect(lower).toBeCalledWith(lc);
  });

  it("should delegate the return value of the lower order function", async () => {
    const result = await spy(lower)(lc);
    expect(result).toEqual("result");
  });

  it("should create a new spy by calling spy factory", async () => {
    spy(lower)(lc);
    expect(spierFactory.makeSpy).toBeCalled();
  });

  it("should spy lower order function after it is called", async () => {
    await spy(lower)(lc);
    expect(spier.track).toBeCalledWith(lc);
  });

  it("should throw error when lower throws an error", async () => {
    lower.mockRejectedValue(new Error("boom"));
    await expect(spy(lower)(lc)).rejects.toThrow("boom");
  });

  it("should track event even when lower throws an error", async () => {
    lower.mockRejectedValue(new Error("boom"));
    await expect(spy(lower)(lc)).rejects.toThrow();
    expect(spier.track).toBeCalledWith(lc);
  });
});
