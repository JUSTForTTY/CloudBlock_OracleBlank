//定时器
private nzTimer;

// 场景一：提交按钮触发表单
//1.提交按钮 id: id123
onClick(){
    //定义事件名称
    needStatus['form']['formsubmit'][按钮id]={  //'form' 在做 'formsubmit' 的时候，我（提交按钮）需要知道状态
        eventname:'submit' //这个状态是我submit事件时需要的，你（表单）需要放到'submit'里
    }

    this.nzTimer = setInterval(() => {
        let res=1,fail=0;
        for (const key in publicStatus[按钮id][eventname]) {
            const element = publicStatus[按钮id][eventname][key];
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