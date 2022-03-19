var Tables=new Array();
var drawingStatus="";
var mouseup=false;
var mousedown=false;
var toggleAttribute;
var selectedTable=null;
var previousX=0;
var previousY=0;
var count=0;
var mycanvas;
var projectLocalStorage = window.localStorage;
var canvas;
var ctx;
var currentTable=null;
var currentHighlightedTable = null;
var currentTableHighlightedIndex = 0;
var mousemove=false;
var username = "";
var color = "black";
function setColor(c) {
   color = c;
   draw(ctx);
}
class Field
{
constructor()
{
this.isPrimaryKey=false;
this.isAutoIncrement=false;
this.isNull=false;
this.isUnique=false;
this.datatype="";
this.fieldWidth="";
this.name="";
}
}
class Table
{
constructor()
{
this.x=0;
this.y=0;
this.width=0;
this.height=0;
this.name="";
this.Fields=[];
this.note="";
this.engine="";
}
}

function setUsername() {
  $("#usernameModal").modal("show");
}

function setup(canvasid)
{
  if (projectLocalStorage.getItem("username") != null) {
    console.log("Username as "+projectLocalStorage.getItem("username"))
    document.getElementById("unSpan").innerHTML = "";
    document.getElementById("unSpan").innerHTML = projectLocalStorage.getItem("username");
  }
  canvas=document.getElementById(canvasid);
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  ctx=canvas.getContext("2d");
  canvas.onmousedown=dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    canvas.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    canvas.onmousemove = elementDrag;
    }
    if (projectLocalStorage.getItem("tables") && projectLocalStorage.getItem("tables") != null) {
      let tablesInLocalStorage = JSON.parse(projectLocalStorage.getItem("tables"));
      for (var t of tablesInLocalStorage) {
        Tables.push(t);
      }
      draw(ctx);
    }  
  function elementDrag(e) {
    let rectt=canvas.getBoundingClientRect();
    let cx=event.clientX-rectt.left;
    let cy=event.clientY-rectt.top;
    e = e || window.event;
    e.preventDefault();
    for(var t of Tables)
    {
    if(cx>=t.x && cx<=t.x+t.width && cx>=t.y && cy<=t.y+t.height)
    {
    canvas.setAttribute("style","cursor:move");
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    t.x=t.x-pos1;
    t.y=t.y-pos2;
    }
  }
  draw(ctx);
 }
  
  function closeDragElement(e) {
    let rectt=canvas.getBoundingClientRect();
    let cx=e.clientX-rectt.left;
    let cy=e.clientY-rectt.top;
    e = e || window.event;
    //mycanvas.removeAttribute("style","cursor:move");
    e.preventDefault();
    for(var t of Tables)
    {
    if(cx>=t.x && cx<=t.x+t.width && cx>=t.y && cy<=t.y+t.height)
    {
    canvas.setAttribute("style","cursor:move");
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    t.x=t.x-pos1;
    t.y=t.y-pos2;
    }
  }

    canvas.onmouseup = null;
    canvas.onmousemove = null;
    canvas.removeAttribute("style","cursor:move");
    draw(ctx);    
  }
}
function setTableDimension(t,f)
{
  ctx=canvas.getContext("2d");
  var textToWrite="";
  var maxWidth=t.width;
  var pk="";
  var autoInc="";
  var nn="";
  var unq = "";
  var fieldWidth = "";
  if (f.fieldWidth!=undefined && f.fieldWidth.length > 0) {
    fieldWidth = "("+f.fieldWidth+")";
  }
  if(f.isPrimaryKey) 
  {
  pk=" primary key";
  }
  if(f.isAutoIncrement)
  {
  autoInc=" auto_increment";
  }
  if(!f.isNull)
  {
  nn=" not null";
  }
  if(f.isUnique)
  {
  unq=" unique";
  }
  textToWrite=f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq;
  if(ctx.measureText(textToWrite).width>maxWidth) {
    maxWidth=ctx.measureText(textToWrite).width;
  }
  if (f.isPrimaryKey) {
    maxWidth += 20;
  }
  /**
   * Code to set New Width
   */
  for(var tt of Tables)
  {
    if(t.name==tt.name)
    {
      tt.width=Math.ceil(maxWidth)+50;
      tt.height=tt.height+40;
      break;    
    }
    
  }
  draw(ctx);
}

function draw(ctx1)
{
ctx1.clearRect(0,0,canvas.width,canvas.height);
    for(var t of Tables)
    {
    ctx1.beginPath();
    ctx1.strokeStyle="black";
    ctx1.rect(t.x,t.y,t.width,t.height);
    ctx1.stroke();
    ctx1.beginPath();
    ctx1.strokeStyle=color;
    let halfWidth=t.width/2;
    let halfHeight=t.height/2;
    ctx1.moveTo(t.x,t.y+halfHeight);
    ctx1.lineTo(t.x+t.width,t.y+halfHeight);
    ctx1.stroke();
    ctx1.beginPath();
    ctx1.fillStyle=color;
    ctx1.fillRect(t.x,t.y,t.width,halfHeight);
    ctx1.stroke();
    ctx.beginPath();
    ctx1.fillStyle="white";
    ctx1.font="20px Arial";
    ctx1.fillText(t.name,t.x+halfWidth-30,t.y+30);
    ctx1.fill();
    ctx1.stroke();
    if(t.Fields.length>0)
    {
      let depth = 0;
      for (var f of t.Fields) {
        ctx1.beginPath();
        ctx1.fillStyle=color;
        ctx1.font="20px Arial";
        var pk="";
        var autoInc="";
        var nn="";
        var unq = "";
        var fieldWidth = "";
        var primaryKeyImage = null;
        if(f.isPrimaryKey) 
        {
          primaryKeyImage = document.getElementById("pkImage");
          pk=" primary key";
        }
        if (f.fieldWidth!=undefined && f.fieldWidth.length > 0) {
          fieldWidth = "("+f.fieldWidth+")";
        }
        if(f.isAutoIncrement)
        {
        autoInc=" auto_increment";
        }
        if(!f.isNull) 
        {
        nn=" not null";
        }
        if(f.isUnique)
        {
        unq=" unique";
        }
        var text =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq;
        if (primaryKeyImage != null) {
          ctx1.drawImage(primaryKeyImage,t.x+10,t.y+t.height/2+15+depth,17,17);
          ctx1.fillText(text,t.x+28,t.y+t.height/2+30+depth);
          ctx1.fill();
          ctx1.stroke();
          ctx1.beginPath();
          ctx1.strokeStyle="black";
          ctx1.moveTo(t.x, t.y+t.height/2+30+depth+10);
          ctx1.lineTo(t.x+t.width,t.y+t.height/2+30+depth+10);
          ctx1.stroke();
          }
        else {
          ctx1.fillText(text,t.x+10,t.y+t.height/2+30+depth);
          ctx1.fill();
          ctx1.stroke();
          ctx1.beginPath();
          ctx1.strokeStyle="black";
          ctx1.moveTo(t.x, t.y+t.height/2+30+depth+10);
          ctx1.lineTo(t.x+t.width, t.y+t.height/2+30+depth+10);
          ctx1.stroke();
        }
        depth += 30;
      }
    }
}
}

function saveFields()
{
var pk=document.getElementById("primaryKey").checked;
var ai=document.getElementById("autoIncrement").checked;
var unq=document.getElementById("isUnique").checked;
var nl=document.getElementById("isNull").checked;
var dt=document.getElementById("dataType").value;
var fieldWidth = document.getElementById("colWidth").value;
var fieldName=document.getElementById("fieldName").value;
var tablenameToSet=document.getElementById("tableName").value;
var tableName=currentTable.name;
var ctx=document.getElementById("mycanvas").getContext("2d");
var engine=document.getElementById("engine").value;
if(tablenameToSet==currentTable.name && (fieldName=="" || fieldName.trim().length==0)) return;
if(tableName==tablenameToSet) {
  return;
}
/**
 * If table name to Set Exist then return
 */
let tableNameExist = false;
for (var t of Tables) {
  if (t.name == tablenameToSet) {
    tableNameExist = true;
    break;
  }
}
if (tableNameExist) {
  alert("Table with name "+tablenameToSet+" exist.Please try with different name");
  return;
}

for(var t of Tables)
{
if(t.name==tableName)
{
t.name=tablenameToSet;
//t.width=ctx.measureText(tablenameToSet).width+80;
}
}
username = document.getElementById("username").value;
currentTable.name=tablenameToSet;
projectLocalStorage.removeItem("tables");
projectLocalStorage.removeItem("username");
projectLocalStorage.setItem("tables",JSON.stringify(Tables));
projectLocalStorage.setItem("username",username);
draw(ctx);
}
function openModal(table)
{
var pk=document.getElementById("primaryKey");
var ai=document.getElementById("autoIncrement");
var unq=document.getElementById("isUnique");
var nl=document.getElementById("isNull");
var fieldName=document.getElementById("fieldName");
var tablenameToSet=document.getElementById("tableName");
pk.checked=false;
ai.checked=false;
unq.checked=false;
nl.checked=false;
fieldName.value="";
tablenameToSet.value="";
  currentTable=table;
  var tableName=document.getElementById("tableName");
  tableName.value=table.name;
  let headingNames=['Field','Datatype','Constraint','Edit','Delete'];
  var thead=document.createElement("thead");
  document.getElementById("fieldTable").innerHTML="";
  thead.setAttribute("class"," text-primary");
  thead.innerHTML="";
  for(let i=0;i<headingNames.length;i++)
  {
   let th=document.createElement("th");
   let textNode=document.createTextNode(headingNames[i]);
   th.appendChild(textNode);
   thead.appendChild(th);
  }
  document.getElementById("fieldTable").appendChild(thead);
  var tbody=document.createElement("tbody");
  for(var field of table.Fields)
  {
    let row=document.createElement("tr");
     let data;
     data=document.createElement("td");
     data.setAttribute("style","color:white");
     data.innerHTML=field.name;
     row.appendChild(data);
     data=document.createElement("td");
     data.setAttribute("style","color:white");
     data.innerHTML=field.datatype;
     row.appendChild(data);
     data=document.createElement("td");
     data.setAttribute("style","color:white");
     let constraint="";
     if(field.isPrimaryKey) constraint+="<i class='fa fa-key'></i>";
     if(field.isAutoIncrement) constraint=constraint+" "+"<i class='fa fa-plus'></i>";
     if(field.isUnique) constraint=constraint+" "+"unique";
     if(field.isNull) constraint=constraint+" "+"null";
     data.innerHTML=constraint;
     row.appendChild(data);
     data=document.createElement("td");
     data.innerHTML="<i class='fa fa-edit'></i>";
     data.setAttribute("style","color:white;cursor:pointer");
     row.appendChild(data);
     data.onclick=function()
     {
     alert("edit");
     }
     data=document.createElement("td");
     data.innerHTML="<i class='fa fa-trash'></i>";
     data.setAttribute("style","color:white;cursor:pointer");
     row.appendChild(data);
     data.onclick=function()
     {
      alert(field.name);
     };
     tbody.appendChild(row);
    }

    document.getElementById("fieldTable").appendChild(tbody);
   $("#myModal").modal("show");
}
function addRow()
{
var pk=document.getElementById("primaryKey").checked;
var ai=document.getElementById("autoIncrement").checked;
var unq=document.getElementById("isUnique").checked;
var nl=document.getElementById("isNull").checked;
var dt=document.getElementById("dataType").value;
var fieldName=document.getElementById("fieldName").value;
var tablenameToSet=document.getElementById("tableName").value;
var fieldWidth = document.getElementById("colWidth").value;
var tableName=currentTable.name;
var engine=document.getElementById("engine").value;
if(fieldName.trim().length==0) {
  alert("Field Name can't be empty");
  return;
}
let field=new Field();
field.isPrimaryKey=pk;
field.isAutoIncrement=ai;
field.isUnique=unq;
field.isNull=nl;
field.fieldWidth
field.datatype=dt;
field.name=fieldName;
field.fieldWidth=fieldWidth;
for(var t of Tables)
{
if(t.name==tableName)
{
t.Fields.push(field);
t.height = t.height+30;
}
}
username = document.getElementById("username").value;
projectLocalStorage.removeItem("tables");
projectLocalStorage.removeItem("username");
projectLocalStorage.setItem("tables",JSON.stringify(Tables));
projectLocalStorage.setItem("username",username);
let headingNames=['Field','Datatype','Constraint','Edit','Delete'];
var thead=document.createElement("thead");
document.getElementById("fieldTable").innerHTML="";
thead.setAttribute("class"," text-primary");
thead.innerHTML="";
for(let i=0;i<headingNames.length;i++)
{
 let th=document.createElement("th");
 let textNode=document.createTextNode(headingNames[i]);
 th.appendChild(textNode);
 thead.appendChild(th);
}
document.getElementById("fieldTable").appendChild(thead);
var tbody=document.createElement("tbody");
for(var f of currentTable.Fields)
{
let row=document.createElement("tr");
let data;
data=document.createElement("td");
data.setAttribute("style","color:white");
   data.innerHTML=f.name;
   row.appendChild(data);
   data=document.createElement("td");
   data.setAttribute("style","color:white");
   data.innerHTML=f.datatype;
   row.appendChild(data);
   data=document.createElement("td");
   data.setAttribute("style","color:white");
   let constraint="";
   if(f.isPrimaryKey) constraint+="<i class='fa fa-key'></i>";
   if(f.isAutoIncrement) constraint=constraint+" "+"<i class='fa fa-plus'></i>";
   if(f.isUnique) constraint=constraint+" "+"unique";
   if(f.isNull) constraint=constraint+" "+"null";
   data.innerHTML=constraint;
   row.appendChild(data);
   data=document.createElement("td");
   data.innerHTML="<i class='fa fa-edit'></i>";
   data.setAttribute("style","color:white;cursor:pointer");
   row.appendChild(data);
   data.onclick=function()
   {
   alert("edit");
   }
   data=document.createElement("td");
   data.innerHTML="<i class='fa fa-trash'></i>";
   data.setAttribute("style","color:white;cursor:pointer");
   row.appendChild(data);
   data.onclick=function()
   {
    alert(f.name);
   };

   tbody.appendChild(row);
}
setTableDimension(currentTable,field);
document.getElementById("fieldTable").appendChild(tbody);
}

function highlightRectangle(canvas,event)
{
mycanvas=canvas;
if(Tables.length==0) return;
ctx=canvas.getContext("2d");
let rect=canvas.getBoundingClientRect();
let x=event.clientX-rect.left;
let y=event.clientY-rect.top;
let tableToHighlight=null;
let tableHighlightedIndex = 0;
for(var t of Tables)
{
if(x>=t.x && x<=t.x+t.width && y>=t.y && y<=t.y+t.height)
{
tableToHighlight=t;
break;
}
tableHighlightedIndex+=1;
}
ctx.clearRect(0,0,canvas.width,canvas.height);
if(tableToHighlight!=null)
{
currentTableHighlightedIndex = tableHighlightedIndex;  
currentHighlightedTable = tableToHighlight;  
for(var t of Tables)
{
  if(t.name==tableToHighlight.name)
  {
  ctx.beginPath();
  ctx.strokeStyle="green";
  ctx.rect(t.x,t.y,t.width,t.height);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle=color;
  let halfWidth=t.width/2;
  let halfHeight=t.height/2;
  ctx.moveTo(t.x,t.y+halfHeight);
  ctx.lineTo(t.x+t.width,t.y+halfHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle=color;
  ctx.fillRect(t.x,t.y,t.width,halfHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle="white";
  ctx.font="20px Arial";
  ctx.fillText(t.name,t.x+halfWidth-30,t.y+30);
  ctx.fill();
  ctx.stroke();  
  ctx.beginPath();
  ctx.fillStyle="green";
  ctx.fillRect(t.x-4,t.y-4,9,9);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle="green";
  ctx.fillRect(t.x-4,t.y-4+t.height,9,9);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle="green";
  ctx.fillRect(t.x-4+t.width,t.y-4,9,9);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle="green";
  ctx.fillRect(t.x-4+t.width,t.y-4+t.height,9,9);
  ctx.fill();
  ctx.stroke();
  if(t.Fields.length>0)
  {
    let depth = 0;
    for (var f of t.Fields) {
      ctx.beginPath();
      ctx.fillStyle=color;
      ctx.font="20px Arial";
      var pk="";
      var autoInc="";
      var nn="";
      var unq = "";
      var fieldWidth = "";
      var primaryKeyImage = null;
      if(f.isPrimaryKey) 
      {
        primaryKeyImage = document.getElementById("pkImage");
        pk=" primary key";
      }
      if (f.fieldWidth!=undefined && f.fieldWidth.length > 0) {
        fieldWidth = "("+f.fieldWidth+")";
      }
      if(f.isAutoIncrement)
      {
      autoInc=" auto_increment";
      }
      if(!f.isNull) 
      {
      nn=" not null";
      }
      if(f.isUnique)
      {
      unq=" unique";
      }
      var text =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq;
      if (primaryKeyImage != null) {
        ctx.drawImage(primaryKeyImage,t.x+10,t.y+t.height/2+15+depth,17,17);
        ctx.fillText(text,t.x+28,t.y+t.height/2+30+depth);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle="black";
        ctx.moveTo(t.x, t.y+t.height/2+30+depth+10);
        ctx.lineTo(t.x+t.width,t.y+t.height/2+30+depth+10);
        ctx.stroke();
        }
      else {
        ctx.fillText(text,t.x+10,t.y+t.height/2+30+depth);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle="black";
        ctx.moveTo(t.x, t.y+t.height/2+30+depth+10);
        ctx.lineTo(t.x+t.width,t.y+t.height/2+30+depth+10);
        ctx.stroke();
      }
    depth += 30;
    }
  }
}
  else
  {
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.rect(t.x,t.y,t.width,t.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle=color;
    let halfWidth=t.width/2;
    let halfHeight=t.height/2;
    ctx.moveTo(t.x,t.y+halfHeight);
    ctx.lineTo(t.x+t.width,t.y+halfHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle=color;
    ctx.fillRect(t.x,t.y,t.width,halfHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle="white";
    ctx.font="20px Arial";
    ctx.fillText(t.name,t.x+halfWidth-30,t.y+30);
    ctx.fill();
    ctx.stroke();
    if(t.Fields.length>0)
    {
      let depth = 0;
      for (var f of t.Fields) {
        ctx.beginPath();
        ctx.fillStyle=color;
        ctx.font="20px Arial";
        var pk="";
        var autoInc="";
        var nn="";
        var unq = "";
        var fieldWidth = "";
        var primaryKeyImage = null;
        if(f.isPrimaryKey) 
        {
          primaryKeyImage = document.getElementById("pkImage");
          pk=" primary key";
        }
        if (f.fieldWidth!=undefined && f.fieldWidth.length > 0) {
          fieldWidth = "("+f.fieldWidth+")";
        }
        if(f.isAutoIncrement)
        {
        autoInc=" auto_increment";
        }
        if(!f.isNull) 
        {
        nn=" not null";
        }
        if(f.isUnique)
        {
        unq=" unique";
        }
        var text =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq;
        if (primaryKeyImage != null) {
          ctx.drawImage(primaryKeyImage,t.x+10,t.y+t.height/2+15+depth,17,17);
          ctx.fillText(text,t.x+28,t.y+t.height/2+30+depth);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.strokeStyle="black";
          ctx.moveTo(t.x, t.y+t.height/2+30+depth+10);
          ctx.lineTo(t.x+t.width,t.y+t.height/2+30+depth+10);
          ctx.stroke();
          }
        else {
          ctx.fillText(text,t.x+10,t.y+t.height/2+30+depth);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.strokeStyle="black";
          ctx.moveTo(t.x, t.y+t.height/2+30+depth+10);
          ctx.lineTo(t.x+t.width,t.y+t.height/2+30+depth+10);
          ctx.stroke();
        }
        depth += 30;
      }
    }
  
  }
}
}
else
{
  currentTableHighlightedIndex = 0;
  currentHighlightedTable = null;
  for(var t of Tables)
  {
  ctx.beginPath();
  ctx.strokeStyle="black";
  ctx.rect(t.x,t.y,t.width,t.height);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle=color;
  let halfWidth=t.width/2;
  let halfHeight=t.height/2;
  ctx.moveTo(t.x,t.y+halfHeight);
  ctx.lineTo(t.x+t.width,t.y+halfHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle=color;
  ctx.fillRect(t.x,t.y,t.width,halfHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle="white";
  ctx.font="20px Arial";
  ctx.fillText(t.name,t.x+halfWidth-30,t.y+30);
  ctx.fill();
  ctx.stroke();
  if(t.Fields.length>0)
  {
    let depth = 0;
    for (var f of t.Fields) {
      ctx.beginPath();
      ctx.fillStyle=color;
      ctx.font="20px Arial";
      var pk="";
      var autoInc="";
      var nn="";
      var unq = "";
      var fieldWidth = "";
      var primaryKeyImage = null;
      if(f.isPrimaryKey) 
      {
      primaryKeyImage = document.getElementById("pkImage");
      pk=" primary key";
      }
      if (f.fieldWidth!=undefined && f.fieldWidth.length > 0) {
        fieldWidth = "("+f.fieldWidth+")";
      }
      if(f.isAutoIncrement)
      {
      autoInc=" auto_increment";
      }
      if(!f.isNull) 
      {
      nn=" not null";
      }
      if(f.isUnique)
      {
      unq=" unique";
      }
      var text =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq;
      if (primaryKeyImage != null) {
        ctx.drawImage(primaryKeyImage,t.x+10,t.y+t.height/2+15+depth,17,17);
        ctx.fillText(text,t.x+28,t.y+t.height/2+30+depth);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle="black";
        ctx.moveTo(t.x, t.y+t.height/2+30+depth+10);
        ctx.lineTo(t.x+t.width,t.y+t.height/2+30+depth+10);
        ctx.stroke();
      }
      else {
        ctx.fillText(text,t.x+10,t.y+t.height/2+30+depth);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle="black";
        ctx.moveTo(t.x, t.y+t.height/2+30+depth+10);
        ctx.lineTo(t.x+t.width,t.y+t.height/2+30+depth+10);
        ctx.stroke();
      }
    depth += 30;
    }
  }

}
}
}

function drawRectangle(cnvs,event)
{
mycanvas=cnvs;
var ctx=cnvs.getContext("2d");
if(drawingStatus!="draw" && projectLocalStorage.getItem("tables") == null) return;
let rect=cnvs.getBoundingClientRect();
let x=event.clientX-rect.left;
let y=event.clientY-rect.top;
for(var t of Tables)
{
if(x>=t.x && x<=t.x+t.width && y>=t.y && y<=t.y+t.height)
{
  openModal(t);
  return;
}
}
ctx=cnvs.getContext("2d");
let table=new Table();
table.x=x;
table.y=y;
table.name="Table "+Tables.length;
table.width=ctx.measureText(table.name).width+80;
table.height=80;
Tables.push(table);
projectLocalStorage.removeItem("tables");
projectLocalStorage.setItem("tables",JSON.stringify(Tables));
draw(ctx);
}
function copyCode() {
  let scriptText = "/* Generated By Scriptify Data Modeler Tool Version 1.0 */\n";
  for (var t of Tables) {
    scriptText += "\n";
    scriptText += "/* Table Name -->> "+t.name+" */ \n\n";
    let tableText = "create table "+t.name+" (\n";
    let j = 0;
    for (var f of t.Fields) {
      let pk="";
      let autoInc="";
      let nn="";
      let unq = "";
      let fieldWidth = "";
      if(f.isPrimaryKey) 
      {
        pk=" primary key";
      }
      if (f.fieldWidth!=undefined && f.fieldWidth.length > 0) {
        fieldWidth = "("+f.fieldWidth+")";
      }
      if(f.isAutoIncrement)
      {
      autoInc=" auto_increment";
      }
      if(!f.isNull) 
      {
      nn=" not null";
      }
      if(f.isUnique)
      {
      unq=" unique";
      }
      let fieldText = "";
      if (j == t.Fields.length-1) {
        if (f.engine != undefined) {
          fieldText =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq+" )"+f.engine+";\n";
        } else {
          fieldText =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq+" )"+";\n";
        }
      } else {
        fieldText =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq+",\n";
      }
      tableText += fieldText;
      j++;
    }
    scriptText += tableText;
  }
  navigator.clipboard.writeText(scriptText);
}

function save()
{
  var codeEditor = document.getElementById("sqlScript");
  /**
   * Fill code Editor with Script
   */
  let scriptText = "/* Generated By Scriptify Data Modeler Tool Version 1.0 */<br/>";
  for (var t of Tables) {
    scriptText += "\n";
    scriptText += "/* Table Name -->> "+t.name+" */<br/><br/>";
    let tableText = "create table "+t.name+" (<br/>";
    let j = 0;
    for (var f of t.Fields) {
      let pk="";
      let autoInc="";
      let nn="";
      let unq = "";
      let fieldWidth = "";
      if(f.isPrimaryKey) 
      {
        pk=" primary key";
      }
      if (f.fieldWidth!=undefined && f.fieldWidth.length > 0) {
        fieldWidth = "("+f.fieldWidth+")";
      }
      if(f.isAutoIncrement)
      {
      autoInc=" auto_increment";
      }
      if(!f.isNull) 
      {
      nn=" not null";
      }
      if(f.isUnique)
      {
      unq=" unique";
      }
      let fieldText = "";
      if (j == t.Fields.length-1) {
        if (f.engine != undefined) {
          fieldText =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq+" )"+f.engine+";<br/>";
        } else {
          fieldText =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq+" )"+";<br/>";
        }
      } else {
        fieldText =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq+",<br/>";
      }
      tableText += fieldText;
      j++;
    }
    scriptText += tableText;
  }
  codeEditor.innerHTML = scriptText;
  codeEditor.value =  scriptText;
  $("#scriptModal").modal("show");
}
function create()
{
  drawingStatus="draw";
  var btn=document.getElementById("create");
  btn.setAttribute("style","border:2px solid red;color:white;background-color:rgb(87, 87, 185)");
}
function del()
{
 if (currentHighlightedTable == null) {
   alert("No table selected to deleted Please,select a table");
 } 
 if (currentHighlightedTable != null) {
   Tables.splice(currentTableHighlightedIndex,1);
   alert("Table :  "+currentHighlightedTable.name+" Removed successfully");
   currentHighlightedTable = null;
   currentTableHighlightedIndex = 0;
   projectLocalStorage.removeItem("tables");
   projectLocalStorage.setItem("tables",JSON.stringify(Tables));
   draw(ctx);
 }
 if (Tables == null || Tables.length ==0) projectLocalStorage.removeItem("tables");

}
