import mysql.connector

class Account_details():

    def __init__(self):

        self.connection = mysql.connector.connect(
        host ="localhost",
        user ="root",
        password = "temp",
        database = "Task_database"

        )

        self.cursor = self.connection.cursor(dictionary=True)

    def close(self):
        self.cursor.close()
        self.connection.close()
    


class Account_data():

    def __init__(self):
        self.db = Account_details()
    
    def query(self, sql):
        
        self.db.cursor.execute(sql)

        return self.db.cursor.fetchall()
    
    def GetAccountName(self, UserName):
        return self.query("SELECT * FROM Account_Table WHERE UserName = %s", (UserName,))
    
    def GetAccountPassword(self, PassWord):

        Username = self.GetAccountName(self)
        AccPassword = self.query("SELECT Password FROM Account_Table WHERE UserName = %s", (Username,))

        if PassWord == AccPassword:
            return True
        else:
            return False