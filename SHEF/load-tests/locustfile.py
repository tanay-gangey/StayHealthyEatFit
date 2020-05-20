from locust import HttpUser, TaskSet, task, between, SequentialTaskSet
import json
from credentials import *
 
class UserBehavior(SequentialTaskSet):
    email = "NOT_FOUND"
    password = "NOT_FOUND"
    username = "NOT_FOUND"
    def on_start(self):
        if len(USER_CREDS) > 0:
            self.username, self.email, self.password = USER_CREDS.pop()
        self.login_signup()
    
    def login_signup(self):
        headers = {'content-type': 'application/json','Accept-Encoding':'gzip'}
        self.client.post("/users",
                        data= json.dumps({"username": self.username,"pass": self.password,"email": self.email}), 
                        headers=headers, 
                        name = "Sign up")
        self.client.post("/checkUsers",
                        data= json.dumps({"username": self.username}), 
                        headers=headers, 
                        name = "Check Username Availability")
        self.client.post("/passcheck",
                        data= json.dumps({"uname": self.username,"pass": self.password}), 
                        headers=headers, 
                        name = "Log In")
        self.client.post("/updatedetails",
                        data= json.dumps({"gender": "male","carbs":40,"cals":1600,"fats":25,"weight":69,"height":175,"protein":35}), 
                        headers=headers, 
                        name = "Fill In Preferences")
        print("---------------IN LOGIN-------------")
        

    
        
    @task
    def reco_analysis(self):
        self.client.get("/foodreco",
                        name = "Get Breakfast Recommendation")
        self.client.get("/lunchreco",
                        name = "Get Lunch Recommendation")
        self.client.get("/dinreco",
                        name = "Get Dinner Recommendation")
        self.client.get("/othreco",
                        name = "Get Other Recommendation")
        self.client.get("/exercisereco",
                        name = "Get Exercise Recommendation")
        
        self.client.get("/fetchstat",
                        name = "Get Graph 1 Data")
        self.client.get("/getdata",
                        name = "Get Graph 2 Data")
        self.client.get("/getdata2",
                        name = "Get Graph 3 Data")
        self.client.get("/getdata3",
                        name = "Get Graph 4 Data")
        self.client.get("/getdata4",
                        name = "Get Graph 5 Data")
        print("---------------IN Recommendation and Analytics-------------")
        

    @task
    def change_pref(self):
        headers = {'content-type': 'application/json','Accept-Encoding':'gzip'}
        self.client.get("/initpref",
                        name = "Get Inital Preferences")
        self.client.post("/changepref",
                        data= json.dumps({"carbs":45,"cals":1800,"fats":20,"weight":72,"height":175,"protein":35}), 
                        headers=headers, 
                        name = "Update Preferences")
        print("---------------IN ChangePREF-------------")
    @task
    def input_food(self):
        headers = {'content-type': 'application/json','Accept-Encoding':'gzip'}
        self.client.post("/idb",
                        data= json.dumps({"breakfood": "EGGNOG","qty": 100}), 
                        headers=headers, 
                        name = "Input Daily Breakfast")
        #print("---------------IN INPUT BREAK-------------")
    
    @task
    def input_lunch(self): 
        headers = {'content-type': 'application/json','Accept-Encoding':'gzip'}
        print("---------------IN INPUT LUNCH-------------")
        self.client.post("/idl",
                        data= json.dumps({"lunchfood": "BABYFOOD,MEAT,CHICK STKS,JR","qty": 100}), 
                        headers=headers, 
                        name = "Input Daily Lunch")
        self.client.post("/idd",
                        data= json.dumps({"dinfood": "BABYFOOD,MEAT,CHICK STKS,JR","qty": 100}), 
                        headers=headers, 
                        name = "Input Daily Dinner")
        self.client.post("/ido",
                        data= json.dumps({"othfood": "CHEESE,BLUE","qty": 100}), 
                        headers=headers, 
                        name = "Input Daily Snacks/Other")
        self.client.post("/exer",
                        data= json.dumps({"exercise": "Bicycling: BMX or mountain","qty": 30}), 
                        headers=headers, 
                        name = "Input Daily Exercise")
        

 
class WebsiteUser(HttpUser):
    wait_time = between(5, 9)
    tasks = [UserBehavior]
