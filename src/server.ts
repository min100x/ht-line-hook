import app from "./app";

const PORT: number = parseInt(process.env["PORT"] || "3000", 10);

app.listen(PORT, (): void => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env["NODE_ENV"] || "development"}`);
});
