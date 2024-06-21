const responseObject = {
    200: { description: 'Success response with data' },
    400: { description: 'Bad Request with error data' },
    401: { description: 'Unauthorized' },
    404: { description: 'Not found with error data' },
    500: { description: 'Server is down' },
};

const securityObject = [
    {
        authenticate: [],
    },
];

module.exports = {
    "swagger": "2.0",
    "info": {
        "title": "Backend Documentation",
        "description": "For Poll and Chat Using Socket Experss Server",
        "version": "1.0.0"
    },
    "host": "localhost:5001",
    "basePath": "/",
    "schemes": [
        "http",
        "https"
    ],
    "tags": [{ "name": "Open" }, { "name": "Auth" }],
    "securityDefinitions": {
        "authenticate": {
            "type": "apiKey",
            "in": "header",
            "name": "Authorization",
            "description": "Please provide the valid access token, if you dont have please login and get the token as response!"
        }
    },
    "paths": {
        "/": {
            "get": {
                "tags": ["Open"],
                "description": "",
                "parameters": [],
                "responses": responseObject
            }
        },
        "/auth/login": {
            "post": {
                "tags": ['Auth'],
                "description": "For user login",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "type": "string",
                                    "example": "abhi@mail.com"
                                },
                                "password": {
                                    "type": "string",
                                    "example": "123456"
                                }
                            }
                        }
                    }
                ],
                "responses": responseObject
            }
        },
        "/auth/signup": {
            "post": {
                "tags": ['Auth'],
                "description": "For user signup",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "example": "any"
                                },
                                "password": {
                                    "example": "any"
                                },
                                "repeat_password": {
                                    "example": "any"
                                },
                                "fullname": {
                                    "example": "any"
                                },
                                "username": {
                                    "example": "any"
                                },
                            }
                        }
                    }
                ],
                "responses": responseObject
            }
        },

        "/poll/create-poll": {
            "post": {
                "tags": ['Poll'],
                "description": "Create a poll",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "question": {
                                    "type": "string",
                                    "example": "Who will win India or America"
                                },
                                "options": {
                                    "type": "object",
                                    "example": [
                                        {
                                            "answers": "India"
                                        },
                                        {
                                            "answers": "America"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ],
                "responses": responseObject,
                "security": securityObject
            }
        },
        "/poll/get-poll": {
            "get": {
                "tags": ['Poll'],
                "description": "Get all poll data",
                "parameters": [
                ],
                "responses": responseObject,
                "security": securityObject
            }
        },
        "/auth/vote-poll": {
            "post": {
                "tags": ['Poll'],
                "description": "Vote for a poll answer",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "_id": {
                                    "example": "any"
                                },
                                "poll_id": {
                                    "example": "any"
                                }
                            }
                        }
                    }
                ],
                "responses": responseObject,
                "security": securityObject
            }
        },

        "/chat/get-chat": {
            "get": {
                "tags": ['Chat'],
                "description": "Get all chat data",
                "parameters": [
                ],
                "responses": responseObject,
                "security": securityObject
            }
        },
    }
}