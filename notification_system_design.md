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

# Stage 2

## Database Choice

I would use PostgreSQL as the primary database because:

* Supports ACID transactions
* Handles large volumes of notification data
* Strong indexing support
* Reliable querying and reporting
* Scales using read replicas and partitioning

---

## Database Schema

### Students Table

```sql
CREATE TABLE Students (
    studentID SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    department VARCHAR(50),
    year INTEGER
);
```

### Notifications Table

```sql
CREATE TABLE Notifications (
    notificationID SERIAL PRIMARY KEY,
    studentID INTEGER,
    notificationType VARCHAR(50),
    message TEXT,
    isRead BOOLEAN DEFAULT FALSE,
    priority INTEGER,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentID)
    REFERENCES Students(studentID)
);
```

### DeliveryLogs Table

```sql
CREATE TABLE DeliveryLogs (
    logID SERIAL PRIMARY KEY,
    notificationID INTEGER,
    status VARCHAR(50),
    deliveredAt TIMESTAMP,
    FOREIGN KEY (notificationID)
    REFERENCES Notifications(notificationID)
);
```

---

## Relationships

Students (1) ---- (Many) Notifications

Notifications (1) ---- (Many) DeliveryLogs

---

## Sample Queries

### Get Unread Notifications

```sql
SELECT *
FROM Notifications
WHERE studentID = 1042
AND isRead = FALSE
ORDER BY createdAt DESC;
```

### Mark Notification As Read

```sql
UPDATE Notifications
SET isRead = TRUE
WHERE notificationID = 101;
```

### Get Placement Notifications

```sql
SELECT *
FROM Notifications
WHERE notificationType = 'Placement'
ORDER BY createdAt DESC;
```

---

## Scalability Considerations

1. Index frequently queried columns.
2. Use read replicas for heavy read traffic.
3. Partition notification data by date.
4. Cache recent notifications using Redis.
5. Use message queues for large-scale notification delivery.

# Stage 3

## Query Optimization

### Given Query

```sql
SELECT *
FROM Notifications
WHERE studentID = 1042
AND isRead = FALSE
ORDER BY createdAt DESC;
```

### Why Can This Become Slow?

As the Notifications table grows to millions of rows:

1. Full table scans become expensive.
2. Filtering by studentID and isRead requires checking many rows.
3. Sorting by createdAt adds extra overhead.
4. Response time increases significantly.

---

## Indexing Strategy

### Composite Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON Notifications(studentID, isRead, createdAt DESC);
```

### Benefits

* Faster filtering by studentID.
* Faster filtering by isRead.
* Faster sorting by createdAt.
* Reduces full table scans.

---

## Why Not Index Every Column?

Indexing every column is a bad idea because:

1. Increased storage usage.
2. Slower INSERT operations.
3. Slower UPDATE operations.
4. Higher maintenance overhead.
5. Many indexes may never be used.

Indexes should only be created for frequently queried columns.

---

## Query: Students Receiving Placement Notifications In Last 7 Days

```sql
SELECT DISTINCT studentID
FROM Notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

### Explanation

* Filters placement notifications.
* Considers only last 7 days.
* DISTINCT avoids duplicate student IDs.
* Useful for reporting and analytics.

---

## Additional Recommended Indexes

### Placement Notification Index

```sql
CREATE INDEX idx_notification_type_created
ON Notifications(notificationType, createdAt);
```

### Read Status Index

```sql
CREATE INDEX idx_notification_read
ON Notifications(isRead);
```
