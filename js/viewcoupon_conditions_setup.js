var conditions = {}
conditions.addButtonHTML = '<a class="addNestButton"><i class="fa fa-plus-circle"></i></a>';
conditions.deleteButtonHTML = '<a class="deleteInput"><i class="fa fa-times-circle"></i></a>';
conditions.options = {
	boolean: {
		options: {
		  	isTrue: {
		  		label: 'TRUE'
		  	},
		  	isFalse: {
		  		label: 'FALSE'
	  		}
  		}
	},
	found: {
		options: {
		  	found: {
		  		label: 'FOUND'
		  	},
		  	notFound: {
		  		label: 'NOT FOUND'
	  		}
	  	}
	},
  	aggregator: {
  		options: {
		  	all: {
		  		label: 'ALL',
		  		value: 'all'
		  	},
		  	any: {
		  		label: 'ANY',
		  		value: 'any'
	  		},
	  		none: {
	  			label: 'NONE',
	  			value: 'none'
  			}
  		}
	},
	operator: {
		options: {
			is: {
				label: 'is',
				value: '=='
			},
			isNot: {
				label: 'is not',
				value: '!='
			},
			equalsOrGreater: {
				label: 'equals or greater than',
				value: '>='
			},
			equalsOrLess: {
				label: 'equals or less than',
				value: '<='
			},
			greaterThan: {
				label: 'greater than',
				value: '>'
			},
			lessThan: {
				label: 'less than',
				value: '<'
			},
			contains: {
				label: 'contains',
				value: '{}'
			},
			doesNotContain: {
				label: 'does not contain',
				value: '!{}'
			},
			isOneOf: {
				label: 'is one of',
				value: '()'
			},
			isNotOneOf: {
				label: 'is not one of',
				value: '!()'
			}
		}
	},
	category: {
		options: {
			blueridge: {
				label: 'Example Category 1',
				value: '12'
			},
			somethingelse: {
				label: 'Example Category 2',
				value: '32'
			}
		}
	}
}
conditions.nests = {
	main: {
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
	},
	combination: {
		label: 'Condition Combination',
		options: 'combination, productCombination, cart',
		priority: 1,
		list: {
			combination: {
  				label: 'Condition Combination',
  				html: `
	  				<div data-nest='combination' class='nest'>If <a name='aggregator' class='inlineInput' data-input="select" data-optiongroup="aggregator">ALL</a> of these conditions are <a name='value' class='inlineInput' data-input="select" data-optiongroup="boolean">TRUE</a>${conditions.deleteButtonHTML}
						<ul>
							<li class="addButtonLi">${conditions.addButtonHTML}</li>
						</ul>
					</div>`
				}
		}
	},
	productCombination : {
		label: 'Product Condition Combination',
		options: 'combination, product',
		priority: 2,
		list: {
  			productCombination: {
  				label: 'Product Condition Combination',
  				html: `
	  				<div data-nest='productCombination' class='nest'>If <a class='inlineInput' data-input="select" data-optiongroup="aggregator" name="aggregator">ALL</a> of these product conditions are <a  class='inlineInput' data-input="select" data-optiongroup="boolean" name="value">TRUE</a>${conditions.deleteButtonHTML}
						<ul>
							<li class="addButtonLi">${conditions.addButtonHTML}</li>
						</ul>
					</div>`
			}
		}
	},
	product : {
		label: 'Product Attributes',
		options: '',
		priority: -1,
		list: {
			productValue: {
				label: 'Item Value',
				html: `Price of item <a name="operator" class='inlineInput' data-input="select" data-optiongroup="operator">greater than</a> <a name="value" class="inlineInput" data-input="number">...</a> ${conditions.deleteButtonHTML}`
			},
			category: {
				label: 'Category',
				html: `Category of item <a name="operator" class='inlineInput' data-input="select" data-optiongroup="operator">is one of</a> <a name="value" class="inlineInput" data-input="select" data-optiongroup="category" multiple="multiple">...</a> ${conditions.deleteButtonHTML}`
			},
			manufacturer: {
				label: 'Manufacturer',
				html: `Manufacturer of item <a name="operator" class='inlineInput' data-input="select" data-optiongroup="operator">is one of</a> <a name="value" class="inlineInput" data-input="select" data-optiongroup="category" multiple="multiple">...</a> ${conditions.deleteButtonHTML}`
			},
			itemList: {
				label: 'Item list',
				html: `Item <a name="operator" class='inlineInput' data-input="select" data-optiongroup="operator">is one of</a> these items <a name="value" class="inlineInput" data-input="text" multiple="multiple">...</a> ${conditions.deleteButtonHTML}`
			}
		}
	},
	cart : {
		label: 'Cart Property',
		options: '',
		priority: -1,
		list: {
			cartValue: {
				label: 'Cart Value',
				html: `Total cart value <a name="operator" class='inlineInput' data-input="select" data-optiongroup="operator">greater than</a> <a name="value" class="inlineInput" data-input="number">...</a> ${conditions.deleteButtonHTML}`
			},
			rowTotalInCart: {
				label: 'Row total in cart',
				html: `Total different rows in cart <a name="operator" class='inlineInput' data-input="select" data-optiongroup="operator">greater than</a> <a name="value" class="inlineInput" data-input="number">...</a> ${conditions.deleteButtonHTML}`
			},
			quantityInCart: {
				label: 'Quantity of items in cart',
				html: `Total quantity of items in cart <a name="operator" class='inlineInput' data-input="select" data-optiongroup="operator">greater than</a> <a name="value" class="inlineInput" data-input="number">...</a> ${conditions.deleteButtonHTML}`
			}
		}
	}
}
