FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src
WORKDIR /app/src
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "9003"]
