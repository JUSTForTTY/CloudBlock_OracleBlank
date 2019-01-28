//定时器
private nzTimer;

// 场景二：提交按钮触发表单，同时触发工作流
//1.提交按钮id: id123 工作流id：work123
onClick(){
    needStatus['form']['formsubmit']['id123']={  
        eventname:'submit' 
    }
    needStatus['work123']['qianyi']['id123']={  
        eventname:'submit'
    }

    this.nzTimer = setInterval(() => {
        let res=1,fail=0;
        for (const key in publicStatus['id123'][eventname]) {
            const element = publicStatus['id123'][eventname][key];
                if(element==-1){
                    fail=1;
                    //失败了，根据key,dosoming...
                    //终止定时器
                    if (this.nzTimer) {
                        clearInterval(this.nzTimer);
                        this.nzTimer=null
                    }
                }else{
                    res=res*element
                }
                
        }
        if(fail==0){
            if(res==1){
                //全成功
            }else{
                //还需等待
            }
        }
        
    }, 300)
}

//2.表单 提交按钮id已经提前绑定 
submit(){
    for (const id in needStatus['form']['formsubmit']) {
            const eventname = needStatus['form']['formsubmit'][id]['eventname'];
            publicStatus[id][eventname]['save']=0//save是状态名称
    }
    doSomething...
    for (const id in needStatus['form']['formsubmit']) {
            const eventname = needStatus['form']['formsubmit'][id]['eventname'];
            publicStatus[id][eventname]['save']=1
    }
}

//3.工作流 提交按钮id已经提前绑定 
submit(){
    for (const id in needStatus['work123']['qianyi']) {
            const eventname = needStatus['work123']['qianyi'][id]['eventname'];
            publicStatus[id][eventname]['qianyi']=0//save是状态名称
    }
    doSomething...
    for (const id in needStatus['work123']['qianyi']) {
            const eventname = needStatus['work123']['qianyi'][id]['eventname'];
            publicStatus[id][eventname]['qianyi']=1
    }
}