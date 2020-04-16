const Pool = require('pg').Pool
const bcrypt = require('bcrypt');
const saltRounds = 10; 

y=0;

const pool = new Pool({
  user: 'project',
  host: 'localhost',
  database: 'shef',
  password: 'password',
  port: 5432,
})

const passcheck = (request, response1) => {
  const { uname,pass } = request.body
   response1.cookie("user", uname);
  pool.query('SELECT password FROM users where name = $1',[uname] ,(error, results) => {
    if (error) {
      throw error
    }
    else if(results.rows.length){
	console.log(results.rows[0]['password'])
    	s=bcrypt.compare(pass,results.rows[0]['password'], function(error, response) {
		if(response)
		{	console.log(response)
			y=1
			console.log(y)
			{response1.status(200).send('Match')}
		}
		else
		{
			y=0
			console.log("hi",y)
			response1.status(200).send('Mismatch')
		}
    
	});
	
	
	
	
     }
    else
    {

       response1.status(200).send(`MisMatch`)	
     }
    
  })
 
  
}
const checkUsers = (request, response) => {
  const {username } = request.body
  pool.query('SELECT * FROM users where name = $1',[username] ,(error, results) => {
    if (error) {
      throw error
    }
    else if(results.rows.length){
    response.status(200).send(`not available`)}
    else
    {

       response.status(200).send(`Available`)	
     }
    
  })
}


const idb = (request, response) => {
  const {breakfood,qty } = request.body
  var mul=qty/100;
  var unm=request.cookies.user;
  var stat="Failure";
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;
	
  }
  var tod=yyyy+'-'+mm+'-'+dd;

  pool.query('SELECT * FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE',[unm] ,(error1, results1) => {
    if (error1) {
      throw error1
    }
    
    pool.query('SELECT * FROM fooddata WHERE foodname=$1',[breakfood] ,(error2, results2) => {
    if (error2) {
      throw error2
    }
    var cals= results2.rows[0]['enegy_kcal'];
    var protein=results2.rows[0]['Protein(g)'];
    var carbs=results2.rows[0]['Carbohydrate(g)'];
    var fats=results2.rows[0]['TotalFat(g)'];
    if(results1.rows[0]['name']==unm)
    {
	var bfast_itms=results1.rows[0]['bfast_itms'];
        var bfast_cal=results1.rows[0]['bfast_cal'];
        var bfast_fat=results1.rows[0]['bfast_fat'];
        var bfast_prot=results1.rows[0]['bfast_prot'];
        var bfast_carb=results1.rows[0]['bfast_carb'];
        
	    bfast_itms=bfast_itms+','+breakfood;
	    bfast_cal=bfast_cal+parseInt(mul*cals);
            bfast_fat=bfast_fat+parseInt(mul*fats);
            bfast_prot=bfast_prot+parseInt(mul*protein);
            bfast_carb=bfast_carb+parseInt(mul*carbs);
	    pool.query('UPDATE dailycalcount SET bfast_itms=$1,bfast_cal=$2,bfast_fat=$3,bfast_prot=$4,bfast_carb=$5 WHERE name=$6 AND date=$7',[bfast_itms,bfast_cal,bfast_fat,bfast_prot,bfast_carb,unm,tod] ,(error, results) => {
	    if (error) {
	      throw error
	    }
            console.log("success");
	    stat="Success"
    
    
  })
            

    }
    else
    {
      cals=parseInt(mul*cals);
      fats=parseInt(mul*fats);
      protein=parseInt(mul*protein);
      carbs=parseInt(mul*carbs);
      pool.query('INSERT INTO dailycalcount(name,bfast_itms,bfast_cal,bfast_fat,bfast_prot,bfast_carb) VALUES($1,$2,$3,$4,$5,$6)',[unm,bfast_itms,bfast_cal,bfast_fat,bfast_prot,bfast_carb] ,(error, results) => {
	    if (error) {
	      throw error
	    }
            console.log("success2");
	    stat="Success2";
            response.status(201).send(stat)
            
    
    
  })
      
     



    }
    
    
  })
    
    
  })
}

const idl = (request, response) => {
  const {lunchfood,qty } = request.body
  var mul=qty/100;
  var unm=request.cookies.user;
  var stat="Failure";
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  var breakfood=lunchfood;
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;

  pool.query('SELECT * FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE',[unm] ,(error1, results1) => {
    if (error1) {
      throw error1
    }
    
    pool.query('SELECT * FROM fooddata WHERE foodname=$1',[breakfood] ,(error2, results2) => {
    if (error2) {
      throw error2
    }
    var cals= results2.rows[0]['enegy_kcal'];
    var protein=results2.rows[0]['Protein(g)'];
    var carbs=results2.rows[0]['Carbohydrate(g)'];
    var fats=results2.rows[0]['TotalFat(g)'];
    if(results1.rows[0]['name']==unm)
    {
	var bfast_itms=results1.rows[0]['lunch_itms'];
        var bfast_cal=results1.rows[0]['lunch_cal'];
        var bfast_fat=results1.rows[0]['lunch_fat'];
        var bfast_prot=results1.rows[0]['lunch_prot'];
        var bfast_carb=results1.rows[0]['lunch_carb'];
        
	    bfast_itms=bfast_itms+','+breakfood;
	    bfast_cal=bfast_cal+parseInt(mul*cals);
            bfast_fat=bfast_fat+parseInt(mul*fats);
            bfast_prot=bfast_prot+parseInt(mul*protein);
            bfast_carb=bfast_carb+parseInt(mul*carbs);
	    pool.query('UPDATE dailycalcount SET lunch_itms=$1,lunch_cal=$2,lunch_fat=$3,lunch_prot=$4,lunch_carb=$5 WHERE name=$6 AND date=$7',[bfast_itms,bfast_cal,bfast_fat,bfast_prot,bfast_carb,unm,tod] ,(error, results) => {
	    if (error) {
	      throw error
	    }
            console.log("success");
	    stat="Success"
    
    
  })
            

    }
    else
    {
      cals=parseInt(mul*cals);
      fats=parseInt(mul*fats);
      protein=parseInt(mul*protein);
      carbs=parseInt(mul*carbs);
      pool.query('INSERT INTO dailycalcount(name,lunch_itms,lunch_cal,lunch_fat,lunch_prot,lunch_carb) VALUES($1,$2,$3,$4,$5,$6)',[unm,bfast_itms,bfast_cal,bfast_fat,bfast_prot,bfast_carb] ,(error, results) => {
	    if (error) {
	      throw error
	    }
            console.log("success2");
	    stat="Success2";
            response.status(201).send(stat)
            
    
    
  })
      
     



    }
    
    
  })
    
    
  })
}


const idd = (request, response) => {
  const {dinfood,qty } = request.body
  var mul=qty/100;
  var unm=request.cookies.user;
  var stat="Failure";
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  var breakfood=dinfood;
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;

  pool.query('SELECT * FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE',[unm] ,(error1, results1) => {
    if (error1) {
      throw error1
    }
    
    pool.query('SELECT * FROM fooddata WHERE foodname=$1',[breakfood] ,(error2, results2) => {
    if (error2) {
      throw error2
    }
    var cals= results2.rows[0]['enegy_kcal'];
    var protein=results2.rows[0]['Protein(g)'];
    var carbs=results2.rows[0]['Carbohydrate(g)'];
    var fats=results2.rows[0]['TotalFat(g)'];
    if(results1.rows[0]['name']==unm)
    {
	var bfast_itms=results1.rows[0]['din_itms'];
        var bfast_cal=results1.rows[0]['din_cal'];
        var bfast_fat=results1.rows[0]['din_fat'];
        var bfast_prot=results1.rows[0]['din_prot'];
        var bfast_carb=results1.rows[0]['din_carb'];
        
	    bfast_itms=bfast_itms+','+breakfood;
	    bfast_cal=bfast_cal+parseInt(mul*cals);
            bfast_fat=bfast_fat+parseInt(mul*fats);
            bfast_prot=bfast_prot+parseInt(mul*protein);
            bfast_carb=bfast_carb+parseInt(mul*carbs);
	    pool.query('UPDATE dailycalcount SET din_itms=$1,din_cal=$2,din_fat=$3,din_prot=$4,din_carb=$5 WHERE name=$6 AND date=CURRENT_DATE',[bfast_itms,bfast_cal,bfast_fat,bfast_prot,bfast_carb,unm] ,(error, results) => {
	    if (error) {
	      throw error
	    }
            console.log("success");
	    stat="Success"
    
    
  })
            

    }
    else
    {
      cals=parseInt(mul*cals);
      fats=parseInt(mul*fats);
      protein=parseInt(mul*protein);
      carbs=parseInt(mul*carbs);
      pool.query('INSERT INTO dailycalcount(name,din_itms,din_cal,din_fat,din_prot,din_carb) VALUES($1,$2,$3,$4,$5,$6)',[unm,bfast_itms,bfast_cal,bfast_fat,bfast_prot,bfast_carb] ,(error, results) => {
	    if (error) {
	      throw error
	    }
            console.log("success2");
	    stat="Success2";
            response.status(201).send(stat)
            
    
    
  })
      
     



    }
    
    
  })
    
    
  })
}

const ido = (request, response) => {
  const {othfood,qty } = request.body
  var mul=qty/100;
  var unm=request.cookies.user;
  var stat="Failure";
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  var breakfood=othfood;
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;

  pool.query('SELECT * FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE',[unm] ,(error1, results1) => {
    if (error1) {
      throw error1
    }
    
    pool.query('SELECT * FROM fooddata WHERE foodname=$1',[breakfood] ,(error2, results2) => {
    if (error2) {
      throw error2
    }
    var cals= results2.rows[0]['enegy_kcal'];
    var protein=results2.rows[0]['Protein(g)'];
    var carbs=results2.rows[0]['Carbohydrate(g)'];
    var fats=results2.rows[0]['TotalFat(g)'];
    if(results1.rows[0]['name']==unm)
    {
	var bfast_itms=results1.rows[0]['other_itms'];
        var bfast_cal=results1.rows[0]['other_cal'];
        var bfast_fat=results1.rows[0]['other_fat'];
        var bfast_prot=results1.rows[0]['other_prot'];
        var bfast_carb=results1.rows[0]['other_carb'];
        
	    bfast_itms=bfast_itms+','+breakfood;
	    bfast_cal=bfast_cal+parseInt(mul*cals);
            bfast_fat=bfast_fat+parseInt(mul*fats);
            bfast_prot=bfast_prot+parseInt(mul*protein);
            bfast_carb=bfast_carb+parseInt(mul*carbs);
	    pool.query('UPDATE dailycalcount SET other_itms=$1,other_cal=$2,other_fat=$3,other_prot=$4,other_carb=$5 WHERE name=$6 AND date=CURRENT_DATE',[bfast_itms,bfast_cal,bfast_fat,bfast_prot,bfast_carb,unm] ,(error, results) => {
	    if (error) {
	      throw error
	    }
            console.log("success");
	    stat="Success"
    
    
  })
            

    }
    else
    {
      cals=parseInt(mul*cals);
      fats=parseInt(mul*fats);
      protein=parseInt(mul*protein);
      carbs=parseInt(mul*carbs);
      pool.query('INSERT INTO dailycalcount(name,other_itms,other_cal,other_fat,other_prot,other_carb) VALUES($1,$2,$3,$4,$5,$6)',[unm,bfast_itms,bfast_cal,bfast_fat,bfast_prot,bfast_carb] ,(error, results) => {
	    if (error) {
	      throw error
	    }
            console.log("success2");
	    stat="Success2";
            response.status(201).send(stat)
            
    
    
  })
      
     



    }
    
    
  })
    
    
  })
}

const exer = (request, response) => {
  const {exercise,qty } = request.body
  var mul=qty/30;
  var unm=request.cookies.user;
  var stat="Failure";
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;

  pool.query('SELECT * FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE',[unm] ,(error1, results1) => {
    if (error1) {
      throw error1
    }
    
    pool.query('SELECT * FROM exercisedata WHERE exercise=$1',[exercise] ,(error2, results2) => {
    if (error2) {
      throw error2
    }
    var cals1= results2.rows[0]['CaloriesBurned(125lb)'];
    var cals2=results2.rows[0]['CaloriesBurned(155lb)'];
    var cals3=results2.rows[0]['CaloriesBurned(185lb)'];
    var cals=cals1+cals2+cals3;
    
    if(results1.rows[0]['name']==unm)
    {
	var  exer_itms=results1.rows[0]['exer_itms'];
        var cal_burnt=results1.rows[0]['cal_burnt'];
        
        
	    exer_itms=exer_itms+','+exercise;
	    cal_burnt=cal_burnt+parseInt(mul*cals);
       
	    pool.query('UPDATE dailycalcount SET exer_itms=$1,cal_burnt=$2 WHERE name=$3 AND date=CURRENT_DATE',[exer_itms,cal_burnt,unm] ,(error, results) => {
	    if (error) {
	      throw error
	    }
            console.log("success");
	    stat="Success"
    
    
  })
            

    }
    else
    {
      cals=parseInt(mul*cals);
      
      pool.query('INSERT INTO dailycalcount(name,exer_itms,cal_burnt) VALUES($1,$2,$3)',[unm,exer_itms,cal_burnt] ,(error, results) => {
	    if (error) {
	      throw error
	    }
            console.log("success2");
	    stat="Success2";
            response.status(201).send(stat)
            
    
    
  })
      
     



    }
    
    
  })
    
    
  })
}



const tri = (request, response) => {
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;

  pool.query('SELECT * FROM dailybmi WHERE date=CURRENT_DATE',[] ,(error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
    
    
  })
}

const getdata = (request, response) => {
   var unm=request.cookies.user;	
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;

  
  pool.query("SELECT bfast_fat,lunch_fat,din_fat,other_fat,bfast_prot,lunch_prot,din_prot,other_prot,bfast_carb,lunch_carb,din_carb,other_carb,cal_burnt FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE", [unm], (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows)
    response.status(200).json(results.rows)
  })
  
}

const getdata2 = (request, response) => {
   var unm=request.cookies.user;	
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;

  
  pool.query("SELECT bfast_cal,lunch_cal,din_cal,other_cal,bfast_fat,lunch_fat,din_fat,other_fat,bfast_prot,lunch_prot,din_prot,other_prot,bfast_carb,lunch_carb,din_carb,other_carb,cal_burnt FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE", [unm], (error, results1) => {
    if (error) {
      throw error
    }
    pool.query("SELECT caloriepref,carbpref,fatpref,proteinpref FROM users WHERE name=$1", [unm], (error, results2) => {
    if (error) {
      throw error

    }
    var ans=new Array()
    ans=ans.concat(results1.rows)
    ans=ans.concat(results2.rows)
    console.log(ans)
    response.status(200).json(ans)
  })
    
  })
  
}

const getdata4 = (request, response) => {
   var unm=request.cookies.user;	
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;

  
  pool.query("SELECT bfast_cal,lunch_cal,din_cal,other_cal,bfast_fat,lunch_fat,din_fat,other_fat,bfast_prot,lunch_prot,din_prot,other_prot,bfast_carb,lunch_carb,din_carb,other_carb,cal_burnt FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE", [unm], (error, results1) => {
    if (error) {
      throw error
    }
    
    console.log(results1.rows)
    response.status(200).json(results1.rows)

    
  })
  
}


const getdata3 = (request, response) => {
   var unm=request.cookies.user;	
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;

  
  pool.query("SELECT date,weight,height FROM dailybmi WHERE name=$1 AND date=CURRENT_DATE", [unm], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  
}

const getfood = (request, response) => {
	
  const { strtomatch } = request.body
  //console.log("hii");
  pool.query("SELECT * FROM fooddata WHERE foodname like '%'||$1||'%' limit 5", [strtomatch], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  
}

const initpref = (request, response) => {
	
  
  //console.log("hii");
  var unm=request.cookies.user;
  pool.query("SELECT caloriepref,carbpref,fatpref,proteinpref,weight,height FROM users WHERE name=$1", [unm], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  
}



const foodreco = (request, response) => {
	
  var unm=request.cookies.user;
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;
  console.log(unm,tod);

  
  pool.query("SELECT bfast_itms FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE", [unm], (error, results1) => {
    if (error) {
      throw error
    }
    console.log(results1.rows);
    var str=results1.rows[0]['bfast_itms'];
    console.log(str);
    var array = str.split(",");
    var ind=new Array()
    var i;
    for (i = 0; i < array.length; i++) {
           if(array[i]=="null")
	   {
              ind.push(i);
            }
      }
    var j;
    for (j = 0; j < ind.length; j++) {
           array.splice(ind[j],1)
      }
    
    console.log(array);
    var ans=new Array();
    var k;

    pool.query("SELECT bfast_itms FROM dailycalcount WHERE name!=$1 AND bfast_itms like '%'||$2||'%' limit 5", [unm,array[0]], (error, results2) => {
    if (error) {
      throw error
    }
    var res = results1.rows[0].bfast_itms
console.log(res)
var res2 = res.split(",")
res2 = res2.splice(1,)
var fin = res2.join(",")
results1.rows[0]['bfast_itms'] = fin
ans=ans.concat(results1.rows)
    ans=ans.concat(results2.rows)
    console.log("ans",results2.rows);
     response.status(200).json(ans) 
	
    
  })
           


   
  })
  
}




const lunchreco = (request, response) => {
	
  var unm=request.cookies.user;
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;
  console.log(unm,tod);

  
  pool.query("SELECT lunch_itms FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE", [unm], (error, results1) => {
    if (error) {
      throw error
    }
    console.log(results1.rows);
    var str=results1.rows[0]['lunch_itms'];
    console.log(str);
    var array = str.split(",");
    var ind=new Array()
    var i;
    for (i = 0; i < array.length; i++) {
           if(array[i]=="null")
	   {
              ind.push(i);
            }
      }
    var j;
    for (j = 0; j < ind.length; j++) {
           array.splice(ind[j],1)
      }
    
    console.log(array);
    var ans=new Array();
    var k;

    pool.query("SELECT lunch_itms FROM dailycalcount WHERE name!=$1 AND lunch_itms like '%'||$2||'%' limit 5", [unm,array[0]], (error, results2) => {
    if (error) {
      throw error
    }
    var res = results1.rows[0].lunch_itms
console.log(res)
var res2 = res.split(",")
res2 = res2.splice(1,)
var fin = res2.join(",")
results1.rows[0]['lunch_itms'] = fin
ans=ans.concat(results1.rows)
    ans=ans.concat(results2.rows)
    console.log("ans",results2.rows);
     response.status(200).json(ans) 
	
    
  })
           


   
  })
  
}

const dinreco = (request, response) => {
	
  var unm=request.cookies.user;
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;
  console.log(unm,tod);

  
  pool.query("SELECT din_itms FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE", [unm], (error, results1) => {
    if (error) {
      throw error
    }
    console.log(results1.rows);
    var str=results1.rows[0]['din_itms'];
    console.log(str);
    var array = str.split(",");
    var ind=new Array()
    var i;
    for (i = 0; i < array.length; i++) {
           if(array[i]=="null")
	   {
              ind.push(i);
            }
      }
    var j;
    for (j = 0; j < ind.length; j++) {
           array.splice(ind[j],1)
      }
    
    console.log(array);
    var ans=new Array();
    var k;

    pool.query("SELECT din_itms FROM dailycalcount WHERE name!=$1 AND din_itms like '%'||$2||'%' limit 5", [unm,array[0]], (error, results2) => {
    if (error) {
      throw error
    }
var res = results1.rows[0].din_itms
console.log(res)
var res2 = res.split(",")
res2 = res2.splice(1,)
var fin = res2.join(",")
results1.rows[0]['din_itms'] = fin
ans=ans.concat(results1.rows)
    ans=ans.concat(results2.rows)
    console.log("ans",results2.rows);
    response.status(200).json(ans)
	
    
  })
           
     

     
  })
  
}
const othreco = (request, response) => {
	
  var unm=request.cookies.user;
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;
  console.log(unm,tod);

  
  pool.query("SELECT other_itms FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE", [unm], (error, results1) => {
    if (error) {
      throw error
    }
    console.log(results1.rows);
    var str=results1.rows[0]['other_itms'];
    console.log(str);
    var array = str.split(",");
    var ind=new Array()
    var i;
    for (i = 0; i < array.length; i++) {
           if(array[i]=="null")
	   {
              ind.push(i);
            }
      }
    var j;
    for (j = 0; j < ind.length; j++) {
           array.splice(ind[j],1)
      }
    
    console.log(array);
    var ans=new Array();
    var k;
    
    pool.query("SELECT other_itms FROM dailycalcount WHERE name!=$1 AND other_itms like '%'||$2||'%' limit 5", [unm,array[0]], (error, results2) => {
    if (error) {
      throw error
    }
    var res = results1.rows[0].other_itms
	console.log(res)
	var res2 = res.split(",")
	res2 = res2.splice(1,)
	var fin = res2.join(",")
	results1.rows[0]['other_itms'] = fin
	ans=ans.concat(results1.rows)
    ans=ans.concat(results2.rows)
    console.log("main",results2.rows);
    response.status(200).json(ans) 
	
    
  })
           
     

    
  })
  
}








const exercisereco = (request, response) => {

  var unm=request.cookies.user;
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;
  console.log(unm,tod);

 
  pool.query("SELECT exer_itms FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE", [unm], (error, results1) => {
    if (error) {
      throw error
    }
    console.log(results1.rows);
    var str=results1.rows[0]['exer_itms'];
    console.log(str);
    var array = str.split(",");
    var ind=new Array()
    var i;
    for (i = 0; i < array.length; i++) {
           if(array[i]=="null")
  {
              ind.push(i);
            }
      }
    var j;
    for (j = 0; j < ind.length; j++) {
           array.splice(ind[j],1)
      }
   
    console.log(array);
    ans=new Array();
    var k;
   
    pool.query("SELECT exer_itms FROM dailycalcount WHERE name!=$1 AND exer_itms like '%'||$2||'%' limit 5", [unm,array[0]], (error, results2) => {
    if (error) {
      throw error
    }
var res = results1.rows[0].exer_itms
console.log(res)
var res2 = res.split(",")
res2 = res2.splice(1,)
var fin = res2.join(",")
results1.rows[0]['exer_itms'] = fin
ans=ans.concat(results1.rows)
    ans=ans.concat(results2.rows)
    console.log("main",ans);
    response.status(200).json(ans)
   

   
  })
           
     

   
  })
 
}






const getexer = (request, response) => {
	
  const { strtomatch } = request.body
  
  pool.query("SELECT * FROM exercisedata WHERE exercise like '%'||$1||'%' limit 5", [strtomatch], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  
}

const fetchstat = (request, response) => {
	
  var unm=request.cookies.user;
  var today=new Date();
  var dd=today.getDate();
  var mm=today.getMonth()+1;
  var yyyy=today.getFullYear();
  
  if(dd<10)
  {
   dd='0'+dd;

  }
  if(mm<10)
  {
   mm='0'+mm;

  }
  var tod=yyyy+'-'+mm+'-'+dd;
  
  pool.query("SELECT * FROM dailycalcount WHERE name=$1 AND date=CURRENT_DATE", [unm], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  
}




const changepref = (request, response) => {
  const {carbs,cals,fats,weight,height,protein } = request.body
  const uname=request.cookies.user;
console.log(uname)
  pool.query('UPDATE users SET caloriepref=$1,carbpref=$2,proteinpref=$3,fatpref=$4,height=$5,weight=$6 WHERE name=$7', [cals,carbs,protein,fats,height,weight,uname], (error, results) => {
    if (error) {
      throw error
    }
    
    
    response.status(201).send(`Data Inserted`)
    
    
 
    
  })
}

const updatedetails = (request, response) => {
  const {gender,carbs,cals,fats,weight,height,protein } = request.body
  const uname=request.cookies.user;
console.log(uname)
  pool.query('UPDATE users SET gender= $1,caloriepref=$2,carbpref=$3,proteinpref=$4,fatpref=$5,height=$6,weight=$7 WHERE name=$8', [gender,cals,carbs,protein,fats,height,weight,uname], (error, results) => {
    if (error) {
      throw error
    }
    pool.query('INSERT INTO dailybmi(name,height,weight) VALUES($1,$2,$3)', [uname,height,weight], (error, results) => {
    if (error) {
      throw error
    }
    pool.query('INSERT INTO dailycalcount(name) VALUES($1)', [uname], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Data Inserted`)
    
  	})
    
  	})
    
  })
}



const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
	console.log("inserted1");
  const { username,pass,email } = request.body
  response.cookie("user", username);
	console.log(request.body);
	console.log(request.body);
  bcrypt.hash(pass, saltRounds, (err, hash) => {
		
			pool.query('INSERT INTO users (name,password,email) VALUES ($1, $2,$3)', [username,hash,email], (error, results) => {
    if (error) {
      throw error
    }
    console.log("inserted");
    response.status(201).send(`Inserted`)
  })
  
  });

  
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}






const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  idd,
  changepref,
  initpref,
  ido,
  exercisereco,
  foodreco,
  getdata,
  getdata2,
  getdata3,
  getdata4,
  othreco,
  lunchreco,
  dinreco,
  tri,
  idl,
  changepref,
  idb,
  exer,
  getfood,
  fetchstat,
  getexer,
  updatedetails,
  passcheck,
  checkUsers,
  getUserById,
  createUser,
  updateUser,
  passcheck,
  deleteUser,
}
