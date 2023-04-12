/***************************************************************************************************************************
* @name         RelatedHandler
* @author       Rakesh Shinde
* @date         12/04/2023
* @description  This class is used to provide data to lwc component
*****************************************************************************************************************************/
public inherited sharing class RelatedHandler {
    
    @AuraEnabled(Cacheable = true)
    /*********************************************************************************************************************************
    * @description  This method used to fetch the contacts according to account 
    * @param	 recId 
    * @return    List<Contact>
    **********************************************************************************************************************************/
    public static List<Contact> getContacts(string recId){
        return [SELECT AccountId,Id, FirstName,LastName, Phone, Email FROM Contact WHERE AccountId = :RecId];
    }
    /*********************************************************************************************************************************
    * @description  This method used to delete the contacts according to account 
    * @param	    lstConIds
    **********************************************************************************************************************************/
    @AuraEnabled
    public static void deleteContacts(list<Id> lstConIds){
        try {
            list<Contact> lstConsToDelete = new list<Contact>();
            for(Id idCon : lstConIds) {
                lstConsToDelete.add(new Contact(Id = idCon));
            }
            if(!lstConsToDelete.isEmpty()) {
                delete lstConsToDelete;
            }
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
}