conditions.initElements = function(){
	$('.addNestButton, .inlineInput, .addButtonInput').off('click blur');
	$('.inlineInputForm').on('blur', conditions.changeInlineToWord);
	$('.inlineInputForm').focus();
	conditions.initInlineElements();
	conditions.initAddButtons();
	conditions.initDeleteButtons();
}

conditions.initInlineElements = function(){
	$('.inlineInput:not(.opened)').on('click', conditions.changeInlineInput);
}
conditions.initDeleteButtons = function(){
	$('.deleteInput').on('click', function(){ $(this).closest('li').remove() });
}
conditions.initAddButtons = function(){
	$('.addNestButton').off('click');
	$('.addNestButton').on('click', function(){
		$(this).closest('li').html(conditions.changeAddButtonToSelection(this));
		$('.addButtonInput').focus();
		$('.addButtonInput').on('change blur', conditions.changeAddButtonInputToWord );
	});
}

conditions.changeInlineInput = function(){
	var currentValue = $(this).html() || optionGroupObj.label;
	var type = $(this).data('input');
	switch(type){
		case 'select':
			var optionsName = $(this).data('optiongroup');
			var optionsList = conditions.options[optionsName].options;
			var selectHTML = '';
			for( var key in optionsList){
				var option = optionsList[key];
			  	selectHTML += `
			  		<option data-optiongroup='${optionsName}' data-option='${key}' value='${option.label}'
			  			${currentValue.split(',').indexOf(option.label) > -1 ? 'SELECTED' : ''}>${option.label}
		  			</option>`
			};
			var selectType = $(this).attr('multiple')
				? 'class="inlineInputForm multipleSelect" multiple="multiple"'
				: 'class="inlineInputForm"';
			var inputHTML = `<select ${selectType}>${selectHTML} ${conditions.deleteButtonHTML}`;
			break;
		case 'text':
			var inputHTML = `<input type='text' class='inlineInputForm'>`;
			break;
		case 'number':
			var inputHTML = `<input type='number' class='inlineInputForm' value='${currentValue}'>`;
			break;
	}
  	$(this).html(inputHTML).addClass('opened');
    conditions.initElements();
}

conditions.changeInlineToWord = function(){
  	$(this).parent().removeClass('opened')
  		.html(($(this).val() == '') ? '...' : $(this).val().toString());
		conditions.initElements();
}

conditions.changeAddButtonInputToWord = function(){
	var selected = $(this).find(':selected');
	($(this).val() !== '')
		? conditions.changeAddButtonToNestHTML(selected)
		: $(this).parent().html(conditions.addButtonHTML);
	conditions.initElements();
}

conditions.changeAddButtonToNestHTML = function(selectedOptionElement){
	var nest = selectedOptionElement.data('nest');
	var nestElement = selectedOptionElement.val();
	var li = selectedOptionElement.closest('li');
	li.data('attribute', nestElement).data('type', nest)
		.html(conditions.nests[nest].list[nestElement].html)
		.removeClass('addButtonLi')
		.parent().append(`<li class="addButtonLi">${conditions.addButtonHTML}</li>`);
}

conditions.changeAddButtonToSelection = function(parent, priority=0){
	var nest = $(parent).data('nest');
	$(parent).parents('.nest').each(function(){
		var tmpNest = $(this).data('nest');
		if(conditions.nests[tmpNest].priority >= priority){
			priority = conditions.nests[tmpNest].priority;
			nest = tmpNest;
		}
	});
	return conditions.getAddButtonSelect(nest);
}

conditions.getAddButtonSelect = function(nest, selectHTML = ''){
	var options = conditions.nests[nest].options.split(',');
	for(var i in options ){
		var option = options[i].trim()
		selectHTML += `<optgroup label=${conditions.nests[option].label}>${conditions.getOptionList(option)}</optgroup>`;
	}
	return '<select class="addButtonInput"><option value="">Please choose</option>'+selectHTML+'</select>';
}

conditions.getOptionList = function(option, optionsHTML = ''){
	var optionList = conditions.nests[option].list;
	for(var i in optionList)
		optionsHTML += `<option data-nest='${option}' value='${i}'>${optionList[i].label}</option>`;
	return optionsHTML;
}

conditions.compileConditions = function(){
	var mainNest = $('#conditionContainer').children('.nest');
	var info = [{
		type       : conditions.nestGetType(mainNest),
		aggregator : conditions.nestGetAggregator(mainNest),
		value      : conditions.nestGetValue(mainNest),
		conditions : conditions.nestGetConditions(mainNest)
	}];
	return info;
}

//Getting Nest Information
conditions.nestGetAggregator = function(ele){ return ele.children('.inlineInput[name="aggregator"]').html().toLowerCase() }
conditions.nestGetValue = function(ele){ return conditions.convertSelectLabelsToValues(ele.children('.inlineInput[name="value"]').html(), 'boolean').toLowerCase() }
conditions.nestGetType = function(ele){ return ele.data('nest') }
conditions.nestGetConditions = function(mainNest){
	var mainNestUL = mainNest.children('ul');
	var conditionArray = [];
	mainNestUL.children('li:not(.addButtonLi)').each(function(){
		if($(this).children('div').length > 0){
			var div = $(this).children('div');
			conditionArray.push({
				type       : conditions.nestGetType(div),
				aggregator : conditions.nestGetAggregator(div),
				value      : conditions.nestGetValue(div),
				conditions : conditions.nestGetConditions(div)
			});
		} else {
			var inputType = $(this).children('.inlineInput[name="value"]').data('input');
			var valueElement = $(this).children('.inlineInput[name="value"]');
			switch(inputType){
				case 'select':
					var value = conditions.convertSelectLabelsToArrayValues(valueElement);
					break;

				default:
					var value = valueElement.html();
			}
			conditionArray.push({
				attribute: $(this).data('attribute'),
				operator: conditions.convertSelectLabelsToArrayValues($(this).children('.inlineInput[name="operator"]')),
				type: $(this).data('type'),
				value: value
			});
		}
	});
	return conditionArray;
}

conditions.convertSelectLabelsToArrayValues = function(element){
	var optGroup = element.data('optiongroup');
	var multiple = element.attr('multiple');
	var listofLabels = element.html();
	var listOfValues = conditions.convertSelectLabelsToValues(listofLabels, optGroup);
	return (multiple) ? listOfValues.split(',') : listOfValues;
}

conditions.convertSelectLabelsToValues = function(list, optGroup){
	var labels = list.split(',');
	var values = [];
	for(var i in conditions.options[optGroup].options){
		var iLabel = conditions.options[optGroup].options[i].label;
		var iValue = conditions.options[optGroup].options[i].value;
		if(labels.indexOf(iLabel) >= 0)
			values.push(iValue || iLabel);
	}
	return values.toString();
}

conditions.convertSelectValuesToLabels = function(list, optGroup){
	var values = Array.isArray(list) ? list : list.split(',');;
	var labels = [];
	for(var i in conditions.options[optGroup].options){
		var iLabel = conditions.options[optGroup].options[i].label;
		var iValue = conditions.options[optGroup].options[i].value;
		if(values.indexOf(iValue) >= 0)
			labels.push(iLabel);
	}
	return labels.toString();
}

conditions.nestSetAggregator = function(position, value){ position.children('.inlineInput[name="aggregator"]').html(value.toUpperCase()) }
conditions.nestSetValue = function(position, value){ position.children('.inlineInput[name="value"]').html(value.toUpperCase()) }
conditions.nestSetConditions = function(position, info){
	for(var i in info){
		if(info[i].conditions !== undefined){
			var newPosition = conditions.nestCreate(position, {
				type: info[i].type,
				aggregator: info[i].aggregator,
				value: info[i].value
			});
            if(info[i].conditions.length > 0)
                conditions.nestSetConditions(newPosition, info[i].conditions);
		} else {
			conditions.conditionCreate(position, info[i]);
		}
	}
}

conditions.nestCreate = function(position, info){
	var nest = info.type;
	var nestElement = info.type;
	var nestHTML = $(conditions.nests[nest].list[nestElement].html);
	conditions.nestSetAggregator(nestHTML, info.aggregator);
	conditions.nestSetValue(nestHTML, info.value);

	var positionAddLocation = position.is('li')
							? position.parent().children('.addButtonLi')
							: position;
	positionAddLocation.removeClass('addButtonLi').html(nestHTML);

	if(position.is('li'))
		position.parent().append('<li class="addButtonLi">'+conditions.addButtonHTML+'</li>');

	return nestHTML.children('ul').children('li');
}

conditions.conditionSetValue = function(position, value){
	var valueElement = position.children('.inlineInput[name="value"]');
	if(valueElement.data('input') == 'select'){
		var optGroup = valueElement.data('optiongroup');
		var value = conditions.convertSelectValuesToLabels(value, optGroup);
	}
	valueElement.html(value);
}
conditions.conditionSetAttribute = function(position, value){ position.data('attribute', value)}
conditions.conditionSetOperator = function(position, value){ position.children('.inlineInput[name="operator"]').html(conditions.convertSelectValuesToLabels(value, 'operator')) }
conditions.conditionSetType = function(position, value){ position.data('type', value)}
conditions.conditionCreate = function(position, info){
	var html = $(`<li>${conditions.nests[info.type].list[info.attribute].html}</li>`);
	conditions.conditionSetType(html, info.type);
	conditions.conditionSetAttribute(html, info.attribute);
	conditions.conditionSetOperator(html, info.operator);
	conditions.conditionSetValue(html, info.value);

	html.insertBefore(position.parent().children('.addButtonLi'));
}
