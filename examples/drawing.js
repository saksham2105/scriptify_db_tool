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
var increaseParameter = "";
var lastModifiedTableDimension = null;
var direction = "";
var factor = 0;
var currentForeignKeyColumn = "";
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
this.isForeignKey = false;
this.foreignKeyRefTable = "";
this.foreignKeyRefColumn = "";
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
this.leftMidX = 0;
this.leftMidY = 0;
this.rightMidX = 0;
this.rightMidY = 0;
this.topMidY = 0;
this.topMidX = 0;
this.bottomMidX = 0;
this.bottomMidY = 0;
}
}

function setUsername() {
  $("#usernameModal").modal("show");
}

function setup(canvasid)
{
  if (projectLocalStorage.getItem("username") != null) {
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
    let cx=e.clientX-rectt.left;
    let cy=e.clientY-rectt.top;
    e = e || window.event;
    e.preventDefault();
    /**
     * Code To Increase of Decrease Height and Width of Table
    */
    for(var t of Tables)
    {
    /**Left Mid X and Y */
    if(cx>=t.leftMidX-4 && cx<=t.leftMidX-4+9 && cy>=t.leftMidY-4 && cy<=t.leftMidY-4+9)
    {
     direction = "left"; 
     lastModifiedTableDimension = t;
     increaseParameter = "width";
    }
    /**Right Mid X and Y */
    if(cx>=t.rightMidX-4 && cx<=t.rightMidX-4+9 && cy>=t.rightMidY-4 && cy<=t.rightMidY-4+9)
    {
      direction = "right"; 
      lastModifiedTableDimension = t;
      increaseParameter = "width";
    }
    /**Top Mid X and Y */
    if(cx>=t.topMidX-4 && cx<=t.topMidX-4+9 && cy>=t.topMidY-4 && cy<=t.topMidY-4+9)
    {
      direction = "top"; 
      lastModifiedTableDimension = t;
      increaseParameter = "height";
    }
    /**Bottom Mid X and Y */
    if(cx>=t.bottomMidX-4 && cx<=t.bottomMidX-4+9 && cy>=t.bottomMidY-4 && cy<=t.bottomMidY-4+9)
    {
      direction = "bottom"; 
      lastModifiedTableDimension = t;
      increaseParameter = "height";
    }
   }
   if (lastModifiedTableDimension != null) {
     return;
   }
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
    t.leftMidX = t.x;
    t.leftMidY = t.y+t.height/2;
    t.rightMidX = t.x+t.width;
    t.rightMidY = t.y+t.height/2;
    t.topMidX = t.x+t.width/2;
    t.topMidY = t.y;
    t.bottomMidX = t.x+t.width/2;
    t.bottomMidY = t.y+t.height;
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
    if (lastModifiedTableDimension != null && lastModifiedTableDimension != undefined) {
      if (increaseParameter == "width") {
        if (cx < lastModifiedTableDimension.x && direction == "left") {
          for (var t of Tables) {
            /**Pulling from left */
            if (t.name == lastModifiedTableDimension.name) {
              console.log("Pulling from "+direction);
              t.width = t.width+Math.abs(t.x-cx);
              t.x = cx;
              t.leftMidX = t.x;
              t.leftMidY = t.y+t.height/2;
              t.rightMidX = t.x+t.width;
              t.rightMidY = t.y+t.height/2;
              t.topMidX = t.x+t.width/2;
              t.topMidY = t.y;
              t.bottomMidX = t.x+t.width/2;
              t.bottomMidY = t.y+t.height;
              increaseParameter = "";
              direction = "";
              factor = 0;
              lastModifiedTableDimension = null;
              projectLocalStorage.removeItem("tables");
              projectLocalStorage.setItem("tables",JSON.stringify(Tables));
              canvas.onmouseup = null;
              canvas.onmousemove = null;
              canvas.removeAttribute("style","cursor:move");
              draw(ctx);
              return;
            }
          } 
        }
        if (cx > lastModifiedTableDimension.x +lastModifiedTableDimension.width && direction == "right" ) {
          for (var t of Tables) {
            /**Pulling from right */
            if (t.name == lastModifiedTableDimension.name) {
              console.log("Pulling from "+direction);
              t.width = t.width+Math.abs(t.x-cx);
              t.leftMidX = t.x;
              t.leftMidY = t.y+t.height/2;
              t.rightMidX = t.x+t.width;
              t.rightMidY = t.y+t.height/2;
              t.topMidX = t.x+t.width/2;
              t.topMidY = t.y;
              t.bottomMidX = t.x+t.width/2;
              t.bottomMidY = t.y+t.height;
              increaseParameter = "";
              direction = "";
              factor = 0;
              lastModifiedTableDimension = null;
              projectLocalStorage.removeItem("tables");
              projectLocalStorage.setItem("tables",JSON.stringify(Tables));
              canvas.onmouseup = null;
              canvas.onmousemove = null;
              canvas.removeAttribute("style","cursor:move");
              draw(ctx);
              return;
            }
          } 
        } 
        if (cx > lastModifiedTableDimension.x && cx<lastModifiedTableDimension.x+lastModifiedTableDimension.width && direction == "left") {
          for (var t of Tables) {
            /**Shrinking from left */
            if (t.name == lastModifiedTableDimension.name) {
              console.log("Shrinking from "+direction);
              t.width = t.width-Math.abs(t.x-cx);
              t.x = cx;
              t.leftMidX = t.x;
              t.leftMidY = t.y+t.height/2;
              t.rightMidX = t.x+t.width;
              t.rightMidY = t.y+t.height/2;
              t.topMidX = t.x+t.width/2;
              t.topMidY = t.y;
              t.bottomMidX = t.x+t.width/2;
              t.bottomMidY = t.y+t.height;
              increaseParameter = "";
              direction = "";
              factor = 0;
              lastModifiedTableDimension = null;
              projectLocalStorage.removeItem("tables");
              projectLocalStorage.setItem("tables",JSON.stringify(Tables));
              canvas.onmouseup = null;
              canvas.onmousemove = null;
              canvas.removeAttribute("style","cursor:move");
              draw(ctx);
              return;
            }
          } 
        }
        if (cx > lastModifiedTableDimension.x && cx<lastModifiedTableDimension.x +lastModifiedTableDimension.width && direction == "right" ) {
          for (var t of Tables) {
            /**Shrinking from right */
            if (t.name == lastModifiedTableDimension.name) {
              console.log("Shrinking from "+direction);
              t.width = t.width-Math.abs(t.x+t.width-cx);
              t.leftMidX = t.x;
              t.leftMidY = t.y+t.height/2;
              t.rightMidX = t.x+t.width;
              t.rightMidY = t.y+t.height/2;
              t.topMidX = t.x+t.width/2;
              t.topMidY = t.y;
              t.bottomMidX = t.x+t.width/2;
              t.bottomMidY = t.y+t.height;
              increaseParameter = "";
              direction = "";
              factor = 0;
              lastModifiedTableDimension = null;
              projectLocalStorage.removeItem("tables");
              projectLocalStorage.setItem("tables",JSON.stringify(Tables));
              canvas.onmouseup = null;
              canvas.onmousemove = null;
              canvas.removeAttribute("style","cursor:move");
              draw(ctx);
              return;
            }
          } 
        }
      }
      if (increaseParameter == "height") {
        if (cy < lastModifiedTableDimension.y && direction == "top") {
          for (var t of Tables) {
            /**Pulling from top */
            if (t.name == lastModifiedTableDimension.name) {
              console.log("Pulling from "+direction);
              t.height = t.height+Math.abs(t.y-cy);
              t.y = cy;
              t.leftMidX = t.x;
              t.leftMidY = t.y+t.height/2;
              t.rightMidX = t.x+t.width;
              t.rightMidY = t.y+t.height/2;
              t.topMidX = t.x+t.width/2;
              t.topMidY = t.y;
              t.bottomMidX = t.x+t.width/2;
              t.bottomMidY = t.y+t.height;
              increaseParameter = "";
              direction = "";
              factor = 0;
              lastModifiedTableDimension = null;
              projectLocalStorage.removeItem("tables");
              projectLocalStorage.setItem("tables",JSON.stringify(Tables));
              canvas.onmouseup = null;
              canvas.onmousemove = null;
              canvas.removeAttribute("style","cursor:move");
              draw(ctx);
              return;
            }
          } 
        }
        if (cy > lastModifiedTableDimension.y +lastModifiedTableDimension.height && direction == "bottom" ) {
          for (var t of Tables) {
            /**Pulling from bottom */
            if (t.name == lastModifiedTableDimension.name) {
              console.log("Pulling from "+direction);
              t.height = t.height+Math.abs(t.y-cy);
              t.leftMidX = t.x;
              t.leftMidY = t.y+t.height/2;
              t.rightMidX = t.x+t.width;
              t.rightMidY = t.y+t.height/2;
              t.topMidX = t.x+t.width/2;
              t.topMidY = t.y;
              t.bottomMidX = t.x+t.width/2;
              t.bottomMidY = t.y+t.height;
              increaseParameter = "";
              direction = "";
              factor = 0;
              lastModifiedTableDimension = null;
              projectLocalStorage.removeItem("tables");
              projectLocalStorage.setItem("tables",JSON.stringify(Tables));
              canvas.onmouseup = null;
              canvas.onmousemove = null;
              canvas.removeAttribute("style","cursor:move");
              draw(ctx);
              return;
            }
          } 
        } 
        if (cy > lastModifiedTableDimension.y && cy < lastModifiedTableDimension.y+lastModifiedTableDimension.height && direction == "top") {
          for (var t of Tables) {
            /**Shrinking from top */
            if (t.name == lastModifiedTableDimension.name) {
              console.log("Shrinking from "+direction);
              t.height = t.height-Math.abs(t.y-cy);
              t.y = cy;
              t.leftMidX = t.x;
              t.leftMidY = t.y+t.height/2;
              t.rightMidX = t.x+t.width;
              t.rightMidY = t.y+t.height/2;
              t.topMidX = t.x+t.width/2;
              t.topMidY = t.y;
              t.bottomMidX = t.x+t.width/2;
              t.bottomMidY = t.y+t.height;
              increaseParameter = "";
              direction = "";
              factor = 0;
              lastModifiedTableDimension = null;
              projectLocalStorage.removeItem("tables");
              projectLocalStorage.setItem("tables",JSON.stringify(Tables));
              canvas.onmouseup = null;
              canvas.onmousemove = null;
              canvas.removeAttribute("style","cursor:move");
              draw(ctx);
              return;
            }
          } 
        }
        if (cy < lastModifiedTableDimension.y+lastModifiedTableDimension.height && direction == "bottom") {
          for (var t of Tables) {
            /**Shrinking from bottom */
            if (t.name == lastModifiedTableDimension.name) {
              console.log("Shrinking from "+direction);
              t.height = t.height-Math.abs(t.y+t.height-cy);
              t.leftMidX = t.x;
              t.leftMidY = t.y+t.height/2;
              t.rightMidX = t.x+t.width;
              t.rightMidY = t.y+t.height/2;
              t.topMidX = t.x+t.width/2;
              t.topMidY = t.y;
              t.bottomMidX = t.x+t.width/2;
              t.bottomMidY = t.y+t.height;
              increaseParameter = "";
              direction = "";
              factor = 0;
              lastModifiedTableDimension = null;
              projectLocalStorage.removeItem("tables");
              projectLocalStorage.setItem("tables",JSON.stringify(Tables));
              canvas.onmouseup = null;
              canvas.onmousemove = null;
              canvas.removeAttribute("style","cursor:move");
              draw(ctx);
              return;
            }
          } 
        }
      }
    }
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
    t.leftMidX = t.x;
    t.leftMidY = t.y+t.height/2;
    t.rightMidX = t.x+t.width;
    t.rightMidY = t.y+t.height/2;
    t.topMidX = t.x+t.width/2;
    t.topMidY = t.y;
    t.bottomMidX = t.x+t.width/2;
    t.bottomMidY = t.y+t.height;
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
  if (f.isForeignKey) {
    textToWrite = f.name+" "+f.datatype+fieldWidth+" foreign key references "+f.foreignKeyRefTable+"("+f.foreignKeyRefColumn+")";
    maxWidth=ctx.measureText(textToWrite).width;
    maxWidth += 20;
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
      tt.leftMidX = tt.x;
      tt.leftMidY = tt.y+tt.height/2;
      tt.rightMidX = tt.x+tt.width;
      tt.rightMidY = tt.y+tt.height/2;
      tt.topMidX = tt.x+tt.width/2;
      tt.topMidY = tt.y;
      tt.bottomMidX = tt.x+tt.width/2;
      tt.bottomMidY = tt.y+tt.height;
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
        if (f.isForeignKey) {
          primaryKeyImage = null;
          text = f.name+" "+f.datatype+fieldWidth+" foreign key references "+f.foreignKeyRefTable+"("+f.foreignKeyRefColumn+")";
        }
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
currentTable.name=tablenameToSet;
projectLocalStorage.removeItem("tables");
projectLocalStorage.setItem("tables",JSON.stringify(Tables));
draw(ctx);
}

function openModal(table)
{
var pk=document.getElementById("primaryKey");
var fk = document.getElementById("foreignKey");
var ai=document.getElementById("autoIncrement");
var unq=document.getElementById("isUnique");
var nl=document.getElementById("isNull");
var fieldName=document.getElementById("fieldName");
var tablenameToSet=document.getElementById("tableName");
var foreignKeyEligibleTables = document.getElementById("foreignKeyEligibleTables");
foreignKeyEligibleTables.innerHTML = "";
document.getElementById("foreignKeyCol").value = "";
fk.disabled = true;
foreignKeyEligibleTables.innerHTML = "";
var options = "";
let optionsCount = 0;
for (var t1 of Tables) {
  if (table.name != t1.name) {
     var isPrimaryKeyPresent = false;
     for (var f of t1.Fields) {
       if (f.isPrimaryKey) {
         isPrimaryKeyPresent = true;
         break;
       }
     }
     if (isPrimaryKeyPresent) {
      if (optionsCount == 0) {
        var option = `<option value="${t1.name}" selected>${t1.name}</option>`;
      } else {
        var option = `<option value="${t1.name}">${t1.name}</option>`;
      }
      optionsCount +=1; 
      options += option;
    }
  }
}
foreignKeyEligibleTables.innerHTML = options;
if (foreignKeyEligibleTables.innerHTML.trim() != "" 
&& foreignKeyEligibleTables.length > 0) {
  setCurrentFKTable();
}
if (foreignKeyEligibleTables.value != undefined && foreignKeyEligibleTables.value != null && foreignKeyEligibleTables.value.trim().length != 0) {
  fk.disabled = false;
}
pk.checked=false;
ai.checked=false;
unq.checked=false;
nl.checked=false;
fk.checked=false;
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
     if (field.isForeignKey) constraint = constraint+" "+"FK "+foreignKeyEligibleTables.value;
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
var fk = document.getElementById("foreignKey").checked;
var ai=document.getElementById("autoIncrement").checked;
var unq=document.getElementById("isUnique").checked;
var nl=document.getElementById("isNull").checked;
var dt=document.getElementById("dataType").value;
var fieldName=document.getElementById("fieldName").value;
var tablenameToSet=document.getElementById("tableName").value;
var fieldWidth = document.getElementById("colWidth").value;
var tableName=currentTable.name;
var engine=document.getElementById("engine").value;
var foreignKeyTableName = document.getElementById("foreignKeyEligibleTables").value;
var foreignKeyColName = document.getElementById("foreignKeyCol").value;
let field=new Field();
field.isPrimaryKey=pk;
field.isAutoIncrement=ai;
field.isUnique=unq;
field.isNull=nl;
field.fieldWidth
field.datatype=dt;
field.name=fieldName;
field.isForeignKey=fk;
field.foreignKeyRefTable = foreignKeyTableName;
field.foreignKeyRefColumn = foreignKeyColName;
field.fieldWidth=fieldWidth;
if(fieldName.trim().length==0 && !field.isForeignKey) {
  alert("Field Name can't be empty");
  return;
}
if (field.isForeignKey) {
  field.name = field.foreignKeyRefTable.toLowerCase()+"_"+field.foreignKeyRefColumn;
}
for(var t of Tables)
{
if(t.name==tableName)
{
t.Fields.push(field);
t.height = t.height+30;
}
}
projectLocalStorage.removeItem("tables");
projectLocalStorage.setItem("tables",JSON.stringify(Tables));
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
   if (f.isForeignKey) constraint = constraint+" "+"FK "+foreignKeyTableName;
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
  /**
   * Left X,Left Y Mid
   */
  ctx.beginPath();
  ctx.fillStyle="green";
  ctx.fillRect(t.leftMidX-4,t.leftMidY-4,9,9);
  ctx.fill();
  ctx.stroke();
    /**
   * Right X,Right Y Mid
   */
  ctx.beginPath();
  ctx.fillStyle="green";
  ctx.fillRect(t.rightMidX-4,t.rightMidY-4,9,9);
  ctx.fill();
  ctx.stroke();
  /**
  * Top X,Top Y Mid
  */
  ctx.beginPath();
  ctx.fillStyle="green";
  ctx.fillRect(t.topMidX-4,t.topMidY-4,9,9);
  ctx.fill();
  ctx.stroke();
  /**
  * Bottom X,Bottom Y Mid
  */
  ctx.beginPath();
  ctx.fillStyle="green";
  ctx.fillRect(t.bottomMidX-4,t.bottomMidY-4,9,9);
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
      if (f.isForeignKey) {
        primaryKeyImage = null;
        text = f.name+" "+f.datatype+fieldWidth+" foreign key references "+f.foreignKeyRefTable+"("+f.foreignKeyRefColumn+")";
      }
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
        if (f.isForeignKey) {
          primaryKeyImage = null;
          text = f.name+" "+f.datatype+fieldWidth+" foreign key references "+f.foreignKeyRefTable+"("+f.foreignKeyRefColumn+")";
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
        if (f.isForeignKey) {
          primaryKeyImage = null;
          text = f.name+" "+f.datatype+fieldWidth+" foreign key references "+f.foreignKeyRefTable+"("+f.foreignKeyRefColumn+")";
        }
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
      if (f.isForeignKey) {
        primaryKeyImage = null;
        text = f.name+" "+f.datatype+fieldWidth+" foreign key references "+f.foreignKeyRefTable+"("+f.foreignKeyRefColumn+")";
      }
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
table.leftMidX = x;
table.leftMidY = y+table.height/2;
table.rightMidX = x+table.width;
table.rightMidY = y+table.height/2;
table.topMidX = x+table.width/2;
table.topMidY = y;
table.bottomMidX = x+table.width/2;
table.bottomMidY = y+table.height;
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
          if (f.isForeignKey) {
            fieldText = f.name+" "+f.datatype+fieldWidth+" foreign key references "+f.foreignKeyRefTable+"("+f.foreignKeyRefColumn+") "+")"+f.engine+";\n";
          }

        } else {
          fieldText =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq+" )"+";\n";
          if (f.isForeignKey) {
            fieldText = f.name+" "+f.datatype+fieldWidth+" foreign key references "+f.foreignKeyRefTable+"("+f.foreignKeyRefColumn+") "+")"+";\n";
          }
        }
      } else {
        fieldText =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq+",\n";
        if (f.isForeignKey) {
          fieldText = f.name+" "+f.datatype+fieldWidth+" foreign key references "+f.foreignKeyRefTable+"("+f.foreignKeyRefColumn+"),\n";
        }
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
          if (f.isForeignKey) {
            fieldText = f.name+" "+f.datatype+fieldWidth+" foreign key references "+f.foreignKeyRefTable+"("+f.foreignKeyRefColumn+") "+")"+f.engine+";<br/>";
          }
  
        } else {
          fieldText =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq+" )"+";<br/>";
          if (f.isForeignKey) {
            fieldText = f.name+" "+f.datatype+fieldWidth+" foreign key references "+f.foreignKeyRefTable+"("+f.foreignKeyRefColumn+") "+")"+";<br/>";
          }

        }
      } 
      else {
        fieldText =f.name+" "+f.datatype+fieldWidth+pk+autoInc+nn+unq+",<br/>";
        if (f.isForeignKey) {
          fieldText = f.name+" "+f.datatype+fieldWidth+" foreign key references "+f.foreignKeyRefTable+"("+f.foreignKeyRefColumn+"),<br/>";
        }
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
function removeAllTables() {
  projectLocalStorage.removeItem("tables");
  draw(ctx);
}
function setCurrentFKTable() {
  var foreignKeyEligibleTables = document.getElementById("foreignKeyEligibleTables");
  var tableName = foreignKeyEligibleTables.value;
  var foreignKeyCol = document.getElementById("foreignKeyCol");
  for (var t of Tables) {
     if (t.name == tableName) {
       for (var f of t.Fields) {
         if (f.isPrimaryKey) {
           currentForeignKeyColumn = f.name;
           break;
         }
       }
     }
  }
  foreignKeyCol.value = currentForeignKeyColumn;
}

