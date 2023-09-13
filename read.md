#IBE 1.0
### ROUTER ###
ADMIN ROUTE - http://localhost:4000/admin

USER ROUTE - http://localhost:4000/user

#### SIGN UP PAGE ####
User will Enter Contact Number
OTP will be generated 
verify OTP
Enter More details
email,fistname , lastname, userRole , refId , role
register user in DB and generate Token

#### SIGN IN PAGE #####
Enter Contact
Generate OTP
Verify OTP
check contact in DB
generate Token

#### UPDATE USER ###
Valid User details using Token
Update the feiled that user wants to updated


### REFERRAL ###
Rquired Contact and Amount
Amount will be distriuted till 15 level in reverse order
[20,10,3,2,1.5,1,0.5,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25]

### TRANSACTION HISTORY ###
Create Transaction history on every payment
Referral Transaction
Project Transaction
Withdraw Transaction

Required Fields
Contact , Transsation amount , type , status , origin 

### WALLET ###
Project Earning - pending and withdrawable
Referral Earning 
Total Earning

Required Fields
constact , projectEarning - pending and withdrawable , referralEarning , totalEarning 

### CREATE PROJECT ###
Required Fields
projectName , contact, projectAmount , projectType , projectDescription , projectDocuments , projectStatus , sanctionedAmount 

### EDIT PROJECT ###
To edit project we need project ID
we can edit any of info as per project details
Only Inprogress project can be edit

### VERIFY PROJECT ###
Standard/Admin Panel can verify project and updated status as verified 
If any of documents not visible or need more info
Admin can place comment on that projet

### APPROVE PROJECT BY ADMIN ###
Only Admin and Super Admin can Approve the project and status should be verified
Project sacntioned amount will be credited to user's wallet and history will be generated but amount will pending until project is completed 

### COMPLETE PROJECT ###
Admin and Super Admin can completed project if status if approved
Amount will be available for user to withdraw 

### WITHDRAW AMOUNT ###
User can withdraw all amount in one go
if KYC is completed
if not user has to complete KYC first
withdraw status will be pending

### COMPLETE WITHDRAW ###
once amount will be paid to user's account 
Admin will update transaction status to complete

### ADMIN CONSOLE ###
There are 3 typs of Admin console
1 - Standard 
2 - Admin
3 - Super_Admin

### STANDARD CONSOLE ###
Stanadrad admin can see inpogress Project and KYC to be verified
Standard admin can verify Project and update project Status
Stand Amdin can verify KYC details

### ADMIN CONSOLE ### 
Admin can see all projects 
Admin can verify , approve , complete project and Kyc
Admin can create Standard user as well

### SUPER ADMIN ###
SA can perform all the task related to project and users
SA can created Admin and Standard user
SA can reset Admin and Standard user password
SA can see logs 

### ADMIN SIGNUP ###
Admin can create Standard admin
Super Admin can create Admin and Standard Admin
only Super Admin reset password
Required Fields 
name , email , password , role 

### ADMIN SIGNIN ###
Required Email and Password
Once logged on Token will be generated
so we can check authorization

### GET USER ###
To Get details of user
Required Emp ID -  BMCS230001

### KYC ###
KYC is mandatory to withdraw amount
Rquired Fields
name , contact , email , status , accountNumber , IFSC Code , Kyc documnets - Pan , Adhar , Statement or cancel check

### FILTER PROJECT ###
we can get projects as per status filter
required project Status Field to get data 

### DELETE USER OR ADMIN ###
Only Super Admin can Delete any type of user
To Delete a user we required email id of the user
We are checking Super Admin Access through JWT then allowing Super Admin to Delete the data from DB
We are Stroing Deleted Users info into DB
For Normal User Required Fields to store in deleted users DB - username , user email , contact , empId , role , deletedBy
For Admin user deletion Required Fields to store in deleted users DB - user name , user email , role , deletedBy

### 2FA AUTH ###
Admin user has to register for 2FA
User can use any auth App like Microsoft Auth or Google App
User Has to verify Code every time when user will try to login

### 2FA RESET ###
Only Super_Admin can reset 2FA
User will recieve QR code on his/her registered email ID

### SECURITY ###
To secure web app we are using token based authentication
With the help of Token we are also checking user Access
To Generate Token we have used JWT with algorithm: 'HS512'
To secure Headers and XSS attack we have used Helmet module
To Secure from Bruet force we have used Middleware 5 max reties and 30 min restriction
To Secure Admin Password we have used bcryptjs to store incrpted password into DB
We are using ENV file to secure Password and DB URLs

#### LOGS ###
For every single activity we are generating Logs and storing them into DB as well as local text file
as of now we are generating two kinds of Info and Error
Log Ex. - 2023-09-06T07:41:44.350Z [INFO]: Activated Admin Login Endpoint

### GET LOGS ###
Only Super Admin can see Logs
We have created Endpoint to get Logs from DB by using Date Filter 
We need Start Date and End Date to see the logs
Date Format in Headers - startdate - 2023-08-23 , enddate - 2023-08-23

### CREATE PRODUCT ###
Only Admin and Super_Admin can create or Add a product from console
Required Fields - productName , productSummary , requiredDoc -  From User end
For Collention Required Fields - productId , productName , productSummary , requiredDoc ,costomerCount ,createdBy , updatedBy , deletedBy
We are tracking activity for product creation, updation and deletion

### EDIT PRODUCT ###
Only Admin and Super_Admin can edit a product from console
To Edit a product we required product Id as per Database and required filed -
like - productName , productSummary , requiredDoc and updatedBy

### DELETE PRODUCT ###
To Delete a product we again required product Id as per Database
Before Deleting we are copying product details to another new collection that is called DeletedProject and we are also inserting deletedBy field

### TO RUN SERVER ###
npm start

### MODULES ###
bcryptjs - To encypt Password 
dotenv - To store All ENV avlibales and secure
express - Framework
express-rate-limit -  Restict user for Multile attempts and BruetForce Attact
helmet -  To secure Header
jsonwebtoken -  To generate Token for authorization
letter-count - counting char which we used in project discription 500 char
mongoose - To create connect with MongoDB Atlas
multer - To perform operation with files uplaod /download
nodemailer - To send OTP or verify email
twilio - To send Otp on mobile
winston - to generate Logs
winston-mongodb - To store logs directly into mongodb 
Cluster -  To Handel Load Balancing
speakeasy - To count string character
qrcode - To Generate QR for 2FA

