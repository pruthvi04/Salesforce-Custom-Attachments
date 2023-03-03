({  
    UpdateDocument : function(component,event,Id) {  
        var action = component.get("c.UpdateFiles");  
        var fName = component.find("fileName").get("v.value");  
        action.setParams({"documentId":Id,  
                          "title": fName,  
                          "recordId": component.get("v.recordId")  
                         });  
        action.setCallback(this,function(response){  
            var state = response.getState();  
            if(state=='SUCCESS'){  
                var result = response.getReturnValue();  
                console.log('Result Returned: ' +result);  
                component.find("fileName").set("v.value", " ");
                result.cdList.forEach(function(record){
                    console.log('record::'+JSON.stringify(record));
                    record.linkTitle = '/'+record.Id;
                    record.linkCreatedBy = record.CreatedBy.Name;
                 });
                component.set("v.files",result.cdList);
                component.set("v.recordsCount",result.cdCount);
            }  
        });  
        $A.enqueueAction(action);  
    },  
})
