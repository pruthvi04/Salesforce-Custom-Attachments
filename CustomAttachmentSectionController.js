({  
    doInit:function(component,event,helper){
        
        var actions = [
            { label: 'Open File', name: 'toOpen' }
        ]
        component.set('v.testColumns', [
            {label: 'Title', fieldName: 'linkTitle', type: 'url', 
             typeAttributes: {label: { fieldName: 'Title' }, target: '_blank'}},
            {label: 'Type', fieldName: 'FileType', type: 'text'},
            {label: 'Created By', fieldName: 'linkCreatedBy', type: 'text', 
             /*typeAttributes: {label: { fieldName: 'CreatedBy.Name' }, target: '_blank'}*/},
            {label: 'Last Modified', fieldName: 'LastModifiedDate', type: 'DateTime'},
            {label: '', type: 'action', typeAttributes: { rowActions: actions }},
        ]);
        
        var action = component.get("c.getFiles");  
        action.setParams({  
            "recordId":component.get("v.recordId")  
        });      
        action.setCallback(this,function(response){  
            var state = response.getState();  
            if(state=='SUCCESS'){  
                var result = response.getReturnValue();  
                console.log('result: ' +result.cdList);
                result.cdList.forEach(function(record){
                    console.log('record::'+JSON.stringify(record));
                    record.linkTitle = '/'+record.Id;
                    record.linkCreatedBy = record.CreatedBy.Name;
                 });
            } 
            component.set("v.files",result.cdList);
            component.set("v.recordsCount",result.cdCount);
        });  
        $A.enqueueAction(action);
    },
    //to open the file
    OpenFile :function(component,event,helper){  
        var action = event.getParam('action');
        var row = event.getParam('row');
        var rec_id = row.Id;
        $A.get('e.lightning:openFiles').fire({ 
            recordIds: [rec_id] 
        });  
    }, 
    
    UploadFinished : function(component, event, helper) {  
        var uploadedFiles = event.getParam("files");  
        var documentId = uploadedFiles[0].documentId;  
        var fileName = uploadedFiles[0].name;  
        helper.UpdateDocument(component,event,documentId);  
        var toastEvent = $A.get("e.force:showToast");  
        toastEvent.setParams({  
            "title": "Success!",  
            "message": "File "+fileName+" Uploaded successfully."  
        });  
        toastEvent.fire();  
    },  
})
