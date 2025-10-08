# DevTinder APIs
## authRouter
- POST /signup
- POST /login
- POST /logout
- GET /profile
- PATCH /profile

## profileRouter 
- GET /profile/view 
- PATCH /profile/edit
- PATCH /profile/password // forgot password API

## connectionRequestRouter 
- POST /request/send/interested/:userId -> combine the both request and made it one like this
- POST /request/send/ignored/:userId    -> POST /request/send/:status/:userId
- POST /request/review/ accepted/:requestId
- POST /request/review/rejected/:requestId 

## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed
- status : ignore / accepted / rejected / interested