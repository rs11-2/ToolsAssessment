/***************************************************************************************************************************
* @name         RelatedHandlerTest
* @author       Rakesh Shinde
* @date         12/04/2023
* @description  This class is used to test RelatedHandler class
*****************************************************************************************************************************/
@isTest
public class RelatedHandlerTest{
    @isTest 
    public static void testGetContacts(){
        //Create a test Account 
        Account testAccount = new Account(Name='Test Account');
        insert testAccount;
        // Create some test Contacts related to the test Account
        List<Contact> testContacts = new List<Contact>{
            new Contact(FirstName='John', LastName='Doe', Phone='555-1234', Email='johndoe@test.com', AccountId=testAccount.Id),
                new Contact(FirstName='Jane', LastName='Doe', Phone='555-5678', Email='janedoe@test.com', AccountId=testAccount.Id)};
        insert testContacts;
        // Call the getContacts method on the RelatedHandler class
        List<Contact> contacts = RelatedHandler.getContacts(testAccount.Id);
        
        // Assert that the method returned the expected Contacts
         System.assertEquals(2, contacts.size(), 'Incorrect number of contacts returned');
        }
@isTest 
    public static void testDeleteContacts() {
        // Create a test Account
        Account testAccount = new Account(Name='Test Account');
        insert testAccount;
        // Create some test Contacts related to the test Account
         List<Contact> testContacts = new List<Contact>{
             new Contact(FirstName='John', LastName='Doe', Phone='555-1234', Email='johndoe@test.com', AccountId=testAccount.Id),
                 new Contact(FirstName='Jane', LastName='Doe', Phone='555-5678', Email='janedoe@test.com', AccountId=testAccount.Id)
                 };
                     insert testContacts;
        // Get the Ids of the test Contacts
        List<Id> contactIds = new List<Id>();
        for (Contact c : testContacts) {
            contactIds.add(c.Id);
        }

        // Call the deleteContacts method on the RelatedHandler class
        Test.startTest();
        RelatedHandler.deleteContacts(contactIds);
        Test.stopTest();
        // Assert that the Contacts were deleted
        List<Contact> remainingContacts = [SELECT Id FROM Contact WHERE AccountId = :testAccount.Id];
        System.assertEquals(0, remainingContacts.size(), 'Contacts were not deleted successfully');
    }
}
