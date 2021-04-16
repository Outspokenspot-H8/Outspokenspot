# Outspokenspot Server

&nbsp;

## Restful endpoints

### Create User

- ***URL***

  ```
  /register
  ```

- ***Method***

  ```
  POST
  ```

- ***Request Header***
    ```
    not needed
    ```

- ***_Request Body_***
    ```
    {
        "username": "<your username>", // string
        "email": "<your email account>", // string
        "password": "<your password>", // string
        "location": "<your location>", // string
    }
    ```

- ***_Response (201)_***
    ```
    {
        "success": true,
        "message": "user created",
        "user": {
            "id": 1,
            "email": "puspa@mail.com"
        }
    }
    ```

- ***_Response (400 - Bad Request)_***
  All empty
    ```
    {
        "message": "Validation error: username is required,\nValidation error: email is required,\nValidation error: invalid email format,\nValidation error: location is required",
        "details": [
            "username is required",
            "email is required",
            "invalid email format",
            "location is required"
        ]
    }
    ```

- ***_Response (500 - Internal Server Error)_ ***
    ```
    {
      "err": "Illegal arguments: undefined, string"
    }
    ```

### Login User

- ***URL***

  ```
  /login
  ```

- ***Method***

  ```
  POST
  ```

- ***_Request Header_***
    ```
    not needed
    ```

- ***_Request Body_***
    ```
    {
        "email": "<your email account>", //string
        "password": "<your password>" //string
    }
    ```

- ***_Response (200)_***
    ```
    {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoiZGFzZUBtYWlsLmNvbSIsImlhdCI6MTYxNTEwNjUwOH0.HmwZFgn7S8L3viB8d15JMY07nM3-47UVNJEv9xFv1M8"
    }
    ```

- ***_Response (500 - Internal Server Error)_***
    ```
    {
        "message" : "Invalid email or password"
    }
    ```

### Get all Questions
> GET /game


- ***URL***

  ```
  /game
  ```

- ***Method***

  ```
  GET
  ```

- ***_Request Header_***
    ```
    {
        "acces_token" : "<your access token>"
    }
    ```

- ***_Request Body_***
    ```
    not needed
    ```

- ***_Response (200)_***
    ```
    [
      {
          "id": 1,
          "question": "Apa sesuatu yang selalu ingin anda katakan kepada saya tetapi tidak bisa?",
          "createdAt": "2021-04-16T04:40:52.219Z",
          "updatedAt": "2021-04-16T04:40:52.219Z"
      },
      {
          "id": 2,
          "question": "Apa arti nama anda? Apakah sesuai dengan dirimu saat ini?",
          "createdAt": "2021-04-16T04:40:52.219Z",
          "updatedAt": "2021-04-16T04:40:52.219Z"
      },
      ....
    ]
    ```

- ***_Response (500 - Internal Server Error)_***
    ```
    {
      "err": "jwt must be provided"
    }
    ```