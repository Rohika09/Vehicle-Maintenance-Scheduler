# Stage 1

## Notification System API Design

### Base URL

```http
/api/v1
```

---

## 1. Get Notifications

### Endpoint

```http
GET /notifications
```

### Headers

```json
{
  "Authorization": "Bearer <token>"
}
```

### Response

```json
{
  "notifications": [
    {
      "id": "123",
      "type": "Placement",
      "message": "TCS hiring drive announced",
      "isRead": false,
      "createdAt": "2026-06-23T10:00:00Z"
    }
  ]
}
```

---

## 2. Get Notification By ID

### Endpoint

```http
GET /notifications/{id}
```

### Headers

```json
{
  "Authorization": "Bearer <token>"
}
```

### Response

```json
{
  "id": "123",
  "type": "Placement",
  "message": "TCS hiring drive announced",
  "isRead": false,
  "createdAt": "2026-06-23T10:00:00Z"
}
```

---

## 3. Create Notification

### Endpoint

```http
POST /notifications
```

### Headers

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Request

```json
{
  "type": "Placement",
  "message": "TCS hiring drive announced"
}
```

### Response

```json
{
  "message": "Notification created successfully"
}
```

---

## 4. Mark Notification As Read

### Endpoint

```http
PATCH /notifications/{id}/read
```

### Headers

```json
{
  "Authorization": "Bearer <token>"
}
```

### Response

```json
{
  "message": "Notification marked as read"
}
```

---

## 5. Delete Notification

### Endpoint

```http
DELETE /notifications/{id}
```

### Headers

```json
{
  "Authorization": "Bearer <token>"
}
```

### Response

```json
{
  "message": "Notification deleted successfully"
}
```

---

## Notification Schema

```json
{
  "id": "string",
  "studentId": "string",
  "type": "Placement | Result | Event",
  "message": "string",
  "isRead": false,
  "createdAt": "timestamp"
}
```

---

## Real-Time Notification Mechanism

The system will use WebSockets for real-time notification delivery.

### Flow

1. Student logs in.
2. Client establishes WebSocket connection.
3. Server pushes notifications instantly.
4. Notification appears without page refresh.

### Benefits

- Real-time updates
- Low latency
- Reduced API polling
- Better user experience