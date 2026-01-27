import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger, setLogLevel, currentLogLevel } from "./index.js";
import { LogLevel } from "./types.js";

describe("logger", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  const originalLogLevel = currentLogLevel;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15T10:30:00.000Z"));
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.useRealTimers();
    setLogLevel(originalLogLevel);
  });

  describe("setLogLevel", () => {
    it("should change the log level", () => {
      setLogLevel(LogLevel.DEBUG);
      logger.debug("test");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("debug", () => {
    it("should log when level is DEBUG", () => {
      setLogLevel(LogLevel.DEBUG);
      logger.debug("debug message");
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy.mock.calls[0][0]).toContain("debug message");
      expect(consoleErrorSpy.mock.calls[0][0]).toContain("DEBUG");
    });

    it("should not log when level is INFO", () => {
      setLogLevel(LogLevel.INFO);
      logger.debug("debug message");
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("info", () => {
    it("should log when level is INFO", () => {
      setLogLevel(LogLevel.INFO);
      logger.info("info message");
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy.mock.calls[0][0]).toContain("info message");
      expect(consoleErrorSpy.mock.calls[0][0]).toContain("INFO");
    });

    it("should not log when level is WARN", () => {
      setLogLevel(LogLevel.WARN);
      logger.info("info message");
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("warn", () => {
    it("should log when level is WARN", () => {
      setLogLevel(LogLevel.WARN);
      logger.warn("warn message");
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy.mock.calls[0][0]).toContain("warn message");
      expect(consoleErrorSpy.mock.calls[0][0]).toContain("WARN");
    });

    it("should not log when level is ERROR", () => {
      setLogLevel(LogLevel.ERROR);
      logger.warn("warn message");
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("error", () => {
    it("should log when level is ERROR", () => {
      setLogLevel(LogLevel.ERROR);
      logger.error("error message");
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy.mock.calls[0][0]).toContain("error message");
      expect(consoleErrorSpy.mock.calls[0][0]).toContain("ERROR");
    });

    it("should always log error messages", () => {
      setLogLevel(LogLevel.ERROR);
      logger.error("error message");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("log level hierarchy", () => {
    it("should log all levels when set to DEBUG", () => {
      setLogLevel(LogLevel.DEBUG);

      logger.debug("debug");
      logger.info("info");
      logger.warn("warn");
      logger.error("error");

      expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
    });

    it("should log info, warn, error when set to INFO", () => {
      setLogLevel(LogLevel.INFO);

      logger.debug("debug");
      logger.info("info");
      logger.warn("warn");
      logger.error("error");

      expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe("timestamp format", () => {
    it("should include ISO timestamp in log output", () => {
      setLogLevel(LogLevel.INFO);
      logger.info("test");
      expect(consoleErrorSpy.mock.calls[0][0]).toContain(
        "2024-01-15T10:30:00.000Z",
      );
    });
  });
});
