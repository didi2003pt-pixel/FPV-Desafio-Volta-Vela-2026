import { getEnv } from "@desafio/config";
import { redactSensitive, shouldLog, type LogLevel } from "@desafio/operations";

type LogData = Record<string, unknown>;

function emit(level: LogLevel, message: string, data: LogData = {}): void {
  const env = getEnv();
  if (!shouldLog(env.LOG_LEVEL, level)) return;

  const record = {
    timestamp: new Date().toISOString(),
    level,
    service: "desafio-volta-web",
    environment: env.NODE_ENV,
    message,
    ...redactSensitive(data) as Record<string, unknown>,
  };

  const line = JSON.stringify(record);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (message: string, data?: LogData) => emit("debug", message, data),
  info: (message: string, data?: LogData) => emit("info", message, data),
  warn: (message: string, data?: LogData) => emit("warn", message, data),
  error: (message: string, data?: LogData) => emit("error", message, data),
};
