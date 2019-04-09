/*****************************
*****  BUDGET CONTROLLER
*****************************/

var budgetController = (function() {

  // Create fist  Class  for expense data
  class  Expense {
      constructor(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
  }
  calcPercentage( totalIncome) {
    if(totalIncome > 0) {
  this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  }
  getPercentage () {
    return this.percentage;
  }
};

  // Create second Class for income data
  class  Income { 
      constructor(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
      }
    };
     
    
    // Create function to calculate the total budget
      var calculateTotal = function(type) {
         var sum = 0;
         data.allItems[type].forEach(function(cur) {
           sum += cur.value;
         });
         data.totals[type] = sum;
      };
      
    // Create one object to store all data 
      var data = {
          allItems: {
            exp:[],  // Array to expense data
            inc:[]   // Array to income data
         },
          totals: {
            exp: 0,
            inc: 0
          },
          budget: 0,
          percentage: -1
      };
  
    // Return function to store all data in the two Arrays 'exp' & 'inc'
    return {
      addItem: function(type, des, val) {
        var ID, newItem;
      
          // Create new ID
          if(data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length - 1].id +1 ; 
          }else{
            ID = 0; 
          }
  
          // Create new item based on 'inc' or 'exp' type
          if(type === 'exp') {
            newItem = new Expense(ID, des, val);
          }else if(type === 'inc') {
            newItem = new Income(ID, des, val);
        }
  
          // Push it into our data structure
          data.allItems[type].push(newItem);
  
          // Return the new element
      return newItem;
    },
  
      deleteItem: function(type, id) {
        var ids, index;
  
      // Find the item in the array
      ids = data.allItems[type].map(function(current) {
        return current.id;
       });
      // Determine the position in that array 
      index = ids.indexOf(id);  
  
      // If the item found in the array remove it
      if(index !== -1) {
        data.allItems[type].splice(index, 1);
       }
      },
  
      calculateBudget: function() {
  
      // Calculate total income and expenses
        calculateTotal('exp');
        calculateTotal('inc');
      // Calculate the budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp ;
      // Calculate the percentage of income that we spent
        if(data.totals.inc > 0) {
          data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        }else{
          data.percentage = -1;
        }
      },
  
      calculatePercentages: function() {
        data.allItems.exp.forEach(cur => cur.calcPercentage(data.totals.inc));
      },
  
      getPercentages: function() {
        var allPerc = data.allItems.exp.map(function(cur) {
          return cur.getPercentage();
        });
        return allPerc;
      },
       
  
      getBudget: function() {
        return {
          budget: data.budget,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp,
          percentage: data.percentage
        }
      },
  
    testing: function() {
      console.log(data);
    }
  
    }
  })();
  
/*****************************
*****  UI CONTROLLER
*****************************/
  
  var UIController = (function() {
   
    var DOMstrings = {
      inputType: document.querySelector('.add__type'),
      inputDescription: document.querySelector('.add__description'),
      inputValue: document.querySelector('.add__value'),
      inputDesVal: document.querySelectorAll('.add__description'+', '+'.add__value'),
      inputDesValTyp: document.querySelectorAll('.add__type' +','+'.add__description' +','+'.add__value'),
      inputBtn: document.querySelector('.add__btn'),
      incomeContainer: document.querySelector('.income__list'),
      expensesContainer: document.querySelector('.expenses__list'),
      budgetLabel: document.querySelector('.budget__value'),
      incomeLabel: document.querySelector('.budget__income--value'),
      expensesLabel: document.querySelector('.budget__expenses--value'),
      percentageLabel: document.querySelector('.budget__expenses--percentage'),
      container:document.querySelector('.container'),
      expensesPercLabel: '.item__percentage',
      dateLabel: document.querySelector('.budget__title--month')
      
      };
  // Format the number [ex: 2554.6289 will be 2,554.63].
    var formateNumber = function(num , type) {
      var numSplit, int ,dec ;
      num = Math.abs(num);
      num = num.toFixed(2);
      numSplit = num.split('.');
      int = numSplit[0];
        if(int.length > 3) {
          int = int.substr(0, int.length - 3)+','+int.substr(int.length - 3, 3);
        }
      dec = numSplit[1];
  
    return (type === 'exp' ? '-':'+')+' '+int+'.'+dec;
  
    };
  

  return {
    // Return the value of the inputs [ Type, Description, Value].
      getInput: function() {
          return {
              type: DOMstrings.inputType.value,
              description: DOMstrings.inputDescription.value,
              // Use parseFloat Method to convert strings data to numbers
              value: parseFloat(DOMstrings.inputValue.value)
          };
        },
    
    // Adds new element on the UI 
       addListItem: function(obj, type) {
         var html, newHtml, element;
            // Create HTML string with placeholder text
            if(type === 'inc') {
              element = DOMstrings.incomeContainer;
              html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    
            }else if(type === 'exp') {
              element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formateNumber(obj.value, type));
            // Insert the HTML into the DOM
            element.insertAdjacentHTML('beforeend', newHtml)
        }, 
  
    // Deletes specific element from the UI
       deleteListItem: function( selectorID ) {
          var el= document.getElementById( selectorID );
              el.parentNode.removeChild(el);
      },
  
       cleareFields: function() {//tested
          var fields, fieldArr;  
            //select all fields we want to clean
            fields = DOMstrings.inputDesVal;
            //call 'from' method from array object to use it with the list of selectors (querySelectAll return 'nodeList' of elements not 'array' so we can't use array method directly)
            fieldArr = Array.from(fields);
            //use forEach method to loop over the elements and clear it
            fieldArr.forEach(cur => cur.value= '');
            //put the focus again on the first field
            fieldArr[0].focus();
      },

    // Prints data comes from  BUDGET CONTROLLER(getBudget Method)  
       displayBudget: function(obj) {
          var type;
            obj.budget > 0 ? type = 'inc': type = 'exp';
            DOMstrings.budgetLabel.textContent= formateNumber(obj.budget, type);
            DOMstrings.incomeLabel.textContent= formateNumber(obj.totalInc, 'inc');
            DOMstrings.expensesLabel.textContent= formateNumber(obj.totalExp, 'exp');
      
            if(obj.percentage > 0) {
            DOMstrings.percentageLabel.textContent= obj.percentage + ' %';
            } else {
            DOMstrings.percentageLabel.textContent= '---';
              
          }
    },

    // Calculates the percentage of Expenses
       displayPercentage: function( percentages) {
          var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
              Array.from(fields).forEach((cur,indx) => {
              if(percentages[indx] > 0) {
                cur.textContent = percentages[indx] + '%';
              } else {
                cur.textContent = '---';
              }
            });
      },

    // Adds the current Month & Year  
       displayMonth: function() {
          var now, month, months, year;
              now = new Date();
              months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
              month = now.getMonth();
              year = now.getFullYear();
        
              DOMstrings.dateLabel.textContent = months[month]+' '+year;
      },
      
    // Changes the style when the user enter Expenses  
       changeType: function() {
          var fields = DOMstrings.inputDesValTyp;
              Array.from(fields).forEach(cur => cur.classList.toggle('red-focus'));
              DOMstrings.inputBtn.classList.toggle('red');
              },
    
    // Returns the value of DOMstrings to use it in anthor Module          
        getDomStrings: function() {
            return DOMstrings;
      }
    };
  })();
  
/*****************************
*****  GLOBAL APP CONTROLLER
******************************/
  
  var controller = (function(budgetCtrl, UICtrl) {
  
    var setupEventListeners = function() {
      var DOM = UICtrl.getDomStrings();
      
      DOM.inputBtn.addEventListener('click', ctrlAddItem);
      document.addEventListener('keypress', function(event) {
         if(event.keyCode === 13 || event.which === 13) {
          ctrlAddItem();
         }
     });
     DOM.container.addEventListener('click', ctrlDeleteItem);
     DOM.inputType.addEventListener('change', UICtrl.changeType);
      
    };
      
  
      var updateBudget = function() {
          //1- Calculate the budget
          budgetCtrl.calculateBudget();
          //2- Return the budget
          var budget = budgetCtrl.getBudget();
          //3- Display the budget on the UI
          UICtrl.displayBudget(budget);
      };
  
      var updatePercentages = function() {
  
          //1. Calculate Percentage
            budgetCtrl.calculatePercentages();
          //2. Read Percentage from the budget controller
            var per = budgetCtrl.getPercentages();
          //3. Update the UI with the new percentages
          UICtrl.displayPercentage(per);
      };
  
      var ctrlAddItem = function() {
  
          //1. Get the field input data
             var input = UIController.getInput();
           
          //2. Add the item to the budget controller
             newItem = budgetCtrl.addItem(input.type, input.description, input.value);
       if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
  
          //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
  
          //4. Clear the fields
            UICtrl.cleareFields();
  
          //5- Calculate and Update budget
            updateBudget();
  
          //6- Calculate and update percentage
            updatePercentages();  
        }
      };
  
      var ctrlDeleteItem = function(event) {
         var itemID, splitID, type, ID;
  
        // Get the target of the main parent of the 'x' or the deleting button
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);
        if(itemID) {
          //1. split the target and put it in new array 'inc-1' will be ['inc','1']
          splitID = itemID.split('-');
          type = splitID[0];
          ID = parseInt(splitID[1]); //Transfere '1' to 1 for example in this case by using 'parseIng' Method
          
          //2. Delete the item from the data structure
          budgetCtrl.deleteItem(type, ID);
  
          //3. Delete the item from the UI
          UICtrl.deleteListItem(itemID);
          //4. Update and show the new budget
          updateBudget();
          updatePercentages(); 
        }
      };
  return {
    init: function() {
      console.log('Application has started. ');
      UICtrl.displayMonth();
      // Reset 'budget' & 'income' & 'expenses' Labels to zero in the begining
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      // 
      setupEventListeners();
    }
  };
     
  })(budgetController, UIController);
  
  controller.init();