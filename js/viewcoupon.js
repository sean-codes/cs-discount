viewcoupon = {
	rule: {
	    info: {
	    	name: 'myRuleName',
	    	description: 'My rule has a description',
	    	code: 'xyz',
	    	is_active: '1',
	    	uses_per_customer: '0',
	    	from_date: '2017-01-10',
	    	to_date: '2017-01-20'
	    },
	    conditions: `[{
            "type":"main",
            "aggregator":"all",
            "value":"false",
            "conditions":[]
        }]`,
	    actions: {
	    	apply: 'percent',
	    	discount_amount: '10'
	    }
	}
}

$(function(){
    viewcoupon.setRule();
    viewcoupon.initInputs();
    conditions.initElements();
});
//Setting Up Rule
viewcoupon.setRule = function(){
	this.setRuleInfo();
	this.setRuleCondtions();
	this.setRuleActions();
}

viewcoupon.setRuleInfo = function(){
	$('[name=ruleInfoName]').val(this.rule.info.name);
	$('[name=ruleInfoCode]').val(this.rule.info.description);
	$('[name=ruleInfoDescription]').val(this.rule.info.code);
	$('[name=ruleInfoIsActive][value='+this.rule.info.is_active+']').attr('CHECKED', true);
	$('[name=ruleInfoUsesPerCustomer]').val(this.rule.info.uses_per_customer);
	$('[name=ruleInfoFromDate]').val(this.rule.info.from_date);
	$('[name=ruleInfoToDate]').val(this.rule.info.to_date);
}

viewcoupon.setRuleCondtions = function(){
	conditions.nestSetConditions($('#conditionContainer'), JSON.parse(viewcoupon.rule.conditions));
}

viewcoupon.setRuleActions = function(){
	$('[name=ruleActionsApply]').val(this.rule.actions.apply);
	$('[name=ruleActionsDiscountAmount]').val(this.rule.actions.discount_amount);
}

//Updating Rule
viewcoupon.getRule = function(){
	this.getRuleInformation();
	this.getRuleCondtions();
	this.getRuleActions();
}

viewcoupon.getRuleInformation = function(){
	this.rule.info = {
		name: $('[name=ruleInfoName]').val(),
		description: $('[name=ruleInfoDescription]').val(),
		code: $('[name=ruleInfoCode]').val(),
		is_active: $('[name=ruleInfoIsActive]:CHECKED').val(),
		uses_per_customer: $('[name=ruleInfoUsesPerCustomer]').val(),
		from_date: $('[name=ruleInfoFromDate]').val(),
		to_date: $('[name=ruleInfoToDate]').val()
	}
}

viewcoupon.getRuleCondtions = function(){
	this.rule.conditions = conditions.compileConditions();
}

viewcoupon.getRuleActions = function(){
	this.rule.actions = {
		apply: $('[name=ruleActionsApply]').val(),
		discount_amount: $('[name=ruleActionsDescription]').val()
	}
}

//Rule Actions (Save, Save and continue, Delete)
viewcoupon.initInputs = function(){
	$('#couponSave').on('click', viewcoupon.saveCoupon);
}

viewcoupon.saveCoupon = function(){
	viewcoupon.getRule();
    console.log(viewcoupon.rule);
    console.log(JSON.stringify(viewcoupon.rule));
}
