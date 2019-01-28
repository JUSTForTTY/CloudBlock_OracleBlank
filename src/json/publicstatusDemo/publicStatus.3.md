//定时器
private nzTimer;

// 场景三：主子表查询
//1.主表
onClick(){
    const eventname1= 'search'//拿数据的，跟着对方走
    const eventname2= 'search'//存放的，跟着自己走
    needStatus['子id'][eventname1]={
        eventname:eventname2
        blockid:'主id'
    }
    //定义事件名称
    needStatus['子id'][eventname1][主id]={  
        eventname:eventname2 
    }

    this.nzTimer = setInterval(() => {
        let res=1,fail=0;
        for (const key in publicStatus['主id'][eventname2]) {
            const element = publicStatus['主id'][eventname2][key];
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

//2.子表
submit(){

    for (const id in needStatus[子id]['search']) {
            const eventname = needStatus[子id]['search'][id]['eventname'];
            publicStatus[id][eventname]['search']=0
    }
    doSomething...
    for (const id in needStatus[子id]['search']) {
            const eventname = needStatus[子id]['search'][id]['eventname'];
            publicStatus[id][eventname]['search']=1
    }
}
