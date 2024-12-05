export function generateShortID(): string {
    return (
      Date.now().toString(36).substring(0, 6) +
      Math.random().toString(36).substring(2, 6)
    ).substring(0, 10);
  }