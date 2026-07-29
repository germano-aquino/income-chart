interface ErrorProps {
  message?: string;
  cause?: ErrorOptions;
  action?: string;
}

export class InternalServerError extends Error {
  public action;
  public statusCode;

  constructor({ message, cause }: ErrorProps) {
    super(message || "Um erro interno não esperado aconteceu.", cause);
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  public action;
  public statusCode;

  constructor({ message, cause }: ErrorProps) {
    super(message || "Método não permitido para este endpoint.", cause);
    this.name = "MethodNotAllowedError";
    this.action = "Verifique se o método HTTP é válido para este endpoint.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  public action;
  public statusCode;

  constructor({ message, cause }: ErrorProps) {
    super(message || "O serviço indisponível no momento.", cause);
    this.name = "ServiceError";
    this.action = "Verifique se o serviço está disponível.";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  public action;
  public statusCode;

  constructor({ message, cause, action }: ErrorProps) {
    super(message || "Um erro de validação ocorreu", cause);
    this.name = "ValidationError";
    this.action = action || "Ajuste os dados utilizados e tente novamente.";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  public action;
  public statusCode;

  constructor({ message, cause, action }: ErrorProps) {
    super(
      message || "Não foi possível encontrar este recurso no sistema",
      cause,
    );
    this.name = "NotFoundError";
    this.action =
      action || "Ajuste os parâmetros utilizados na cosulta e tente novamente.";
    this.statusCode = 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class UnauthorizedError extends Error {
  public action;
  public statusCode;

  constructor({ message, cause, action }: ErrorProps) {
    super(
      message || "Não foi possível encontrar este recurso no sistema",
      cause,
    );
    this.name = "UnauthorizedError";
    this.action =
      action || "Ajuste os parâmetros utilizados na cosulta e tente novamente.";
    this.statusCode = 401;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ForbiddenError extends Error {
  public action;
  public statusCode;

  constructor({ message, cause, action }: ErrorProps) {
    super(message || "Acesso negado.", cause);
    this.name = "ForbiddenError";
    this.action =
      action || "Verifique as features necessárias e tente novamente.";
    this.statusCode = 403;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
