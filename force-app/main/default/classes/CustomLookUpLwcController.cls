public class CustomLookUpLwcController {
 @AuraEnabled
    public static List<String> fetchLookUpValues(String searchKeyWord, String objectName) {
        String fieldsToReturn = 'id, Name';
        return CustomLookUpLwcController.fetchExtendedLookUpValues(searchKeyWord, objectName, fieldsToReturn);
    }

    @AuraEnabled
    public static List<String> fetchExtendedLookUpValues(String searchKeyWord, String objectName,String fieldsToQuery) {
        String realObjectName = String.escapeSingleQuotes(objectName);
        String realFieldsToQuery = String.escapeSingleQuotes(fieldsToQuery);
        String searchKey = searchKeyWord + '%';
    
        
        System.debug('In Service function');
        
        
        List<String> returnList = new List <String>();
        
        
       // return restRes;
        
       /* List<sObject> returnList = new List <sObject>();
      
        // Create a Dynamic SOQL Query For Fetch Record List with LIMIT 5   
        String sQuery =  'select '+  realFieldsToQuery +' from ' + realObjectName + ' where Name LIKE :searchKey order by createdDate DESC limit 10';
        
        try {
            List <sObject> lstOfRecords = Database.query(sQuery);
            for (sObject obj: lstOfRecords) {
                returnList.add(obj);
            }
        } catch (Exception e) {
            throw new AuraHandledException('That didn\'n work:'+sQuery+'\n'+e.getMessage());
        }
        return returnList;*/

	return returnList;
    }
    
    @AuraEnabled
    public static Response service( String path, String method, String responseFormat, String bodyContent,String key, String bodyContentType) {
        System.debug('In Service function');
        System.debug('key-->'+key);
        System.debug('path-->'+path);
        HttpRequest request = buildRequest(path, method, responseFormat, bodyContent, key,bodyContentType);
        HttpResponse httpRes = sendRequest(request);
        Response restRes = buildResponse(httpRes);
         System.debug('Response-->'+restRes);
        return restRes;
    }
    
    public class Response {

        @AuraEnabled
        public String status { get; set; }
        @AuraEnabled
        public Integer statusCode { get; set; }
        @AuraEnabled
        public String body { get; set; }
    }
    
    private static HttpRequest buildRequest(String path, String method, String responseFormat, String bodyContent, String key, String bodyContentType) {
        HttpRequest request = new HttpRequest();
        request.setEndpoint(path);
        request.setMethod(method);
        if (bodyContent != null) {
            request.setBody(bodyContent);
            request.setHeader('Content-Type', bodyContentType);
        }
        request.setHeader('Authorization', 'Basic ' + key);
        request.setHeader('ACCEPT', responseFormat);
        return request;
    }
    private static HttpResponse sendRequest(HttpRequest request) {
        return new Http().send(request);
        
    }
    
    private static Response buildResponse(HttpResponse httpRes) {
        Response restRes = new Response();
        restRes.status = httpRes.getStatus();
        restRes.statusCode = httpRes.getStatusCode();
        restRes.body = httpRes.getBody();
        return restRes;
    }
    
    
}