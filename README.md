# cs-discount
Front-End Discount Interface

![Alt text](https://raw.githubusercontent.com/sean-codes/cs-discount/master/img/couponform.png)

Dynamically building conditions

![Alt text](https://raw.githubusercontent.com/sean-codes/cs-discount/master/img/conditions.gif)

HTML for inline inputs

    //class: inlineInput to get initialized
    //data-input: type of input (select, text, number)
    //data-optiongroup: the group of options to use for this input
    //name: the value this can be (aggregator, operator, value)
    //multiple=multiple: for multi select options
    <a name='aggregator' class='inlineInput' data-input="select" data-optiongroup="aggregator">ALL</a>
    
HTML for nests (combinations)
    
    //nest: the type of nest this is
    //class: nest to get initialized
    //html: needs a aggregator and value
    //ul with li and button (will be moving this to javascript side)
    <div data-nest='combination' class='nest'>If <a name='aggregator' class='inlineInput' data-input="select" data-optiongroup="aggregator">ALL</a> of these conditions are <a name='value' class='inlineInput' data-input="select" data-optiongroup="boolean">TRUE</a>${conditions.deleteButtonHTML}
        <ul>
            <li class="addButtonLi">${conditions.addButtonHTML}</li>
        </ul>
    </div>

Data Structure for options:

    optionName: {
        options: {
            label: 'string',
            value: 'is optional'
        }
    }
    
Data Structure for nests:

    conditions.nests = {
	    nestName: {
		    label: 'Condition Combination',
		    options: 'combination, productCombination, cart',
		    priority: 1,
		    list: {
  			    main: {
	  			    label: 'Condition Combination',
	  			    html: `
	  				    <div data-nest='main' class='nest'>If <a name='aggregator' class='inlineInput' data-input="select" data-optiongroup="aggregator">ALL</a> of these conditions are <a name='value' class='inlineInput' data-input="select" data-optiongroup="boolean">TRUE</a>
						    <ul>
							    <li class="addButtonLi">${conditions.addButtonHTML}</li>
						    </ul>
					    </div>`
			    }
		    }
	    }
