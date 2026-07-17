
import mysql.connector


class Data_base():

    def __init__(self):

        self.connection = mysql.connector.connect(
        host ="localhost",
        user ="root",
        password = "temp",
        database = "Task_database"
        )

        self.cursor = self.connection.cursor(dictionary=True)#creates cursor object for the databse to properly fetch data and connect, then sorts it to be more visually appealing and easier access by associating rows and columns through "names" instead of number values using the dictionary=True


class Task_data():

    def __init__(self):
        self.db = Data_base()

    def query(self, sql):
        
        self.db.cursor.execute(sql)

        return self.db.cursor.fetchall()
    
    def GetCompletedTasks(self):

        return self.query("SELECT * FROM Tasks_Table WHERE status = 'completed'")
    
    def GetUncompletedTasks(self):

        return self.query("SELECT * FROM Tasks_Table WHERE status = 'uncompleted'")

        
    def GetLists(self, ListID):

        return self.query("SELECT * FROM Lists_Table WHERE ListID = %s ", (ListID,))


