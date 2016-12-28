$(function(){
  //Modal Tabs
  $('#myTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    $('#myTabs a').removeClass('btn-primary');
    this.classList.add('btn-primary');
  });
  //Date Range
  $('input[name="daterange"]').daterangepicker();

  //Modal Reset
  $('#discountBuild').on('hidden.bs.modal', function () {
    $('#discountBuildTitle').val('');
    $('.discountBuildType').removeClass('btn-primary');
    $('.discountBuildValue').val('');
    $('#discountBuildOrderTotal').val('');
    $('#discountBuildStates').val('');
    $('#discountDateStart').val('');
    $('#discountDateEnd').val('');
  });
  
  //Start Discount List
  discount.loadList();
  //Discount Modal
  $('.buildDiscountCriteriaAdd').on('click', function(e){
    discount.buildCriteriaAdd();
  });

  $('.discountBuildType').on('click', function(){
    discount.editing.type = this.id.split('_')[1];
  });

  $('.discountBuildShippingValue').on('click', function(){
    discount.editing.value = this.value;
  });

  $('.discountBuildValue').on('blur', function(){
    discount.editing.value = this.value;
  });

  $('#discountBuildTitle').on('blur', function(){
    discount.editing.title = this.value;
  });

  $('#discountBuildDate').on('change', function(){
    discount.editing.date = $('#discountBuildDate').val();
  });

  $('#discountBuildSave').on('click', function(){
    var codeID = $(this).data('id');
    discount.list[codeID] = JSON.parse(JSON.stringify(discount.editing));
    discount.loadList();
    $('#discountBuild').modal('hide');
  });
});

discount = {
  editing: {}
};
discount.list = {
  'xyz': {
    id: '1',
    title: 'My Test Discount',
    type: 'dollar',
    value: '15',
    orderTotal: '115',
    date: '12/22/2016 - 12/23/2016',
    criteria: [{
      name: 'Some Filter Name',
      quantity: '1',
      manufacturer: 'Blueridge',
      category: 'Air Quality'
    }]
  },
  '10OFF': {
    id: '2',
    title: 'My Test Discount 10OFF',
    type: 'percent',
    value: '10',
    orderTotal: '115',
    date: '12/22/2016 - 12/23/2016',
    criteria: [{
      name: 'Air Conditioner',
      quantity: '1',
      manufacturer: 'Blueridge'
    }]
  },
  'Free Shipping': {
    id: '3',
    title: 'My Test Discount Free Shipping',
    type: 'shipping',
    value: '1',
    orderTotal: '115',
    date: '12/22/2016 - 01/25/2017',
    criteria: [{
      name: 'Air Conditioner',
      quantity: '1',
      manufacturer: 'Blueridge'
    }]
  }
}

discount.loadList = function(){
  $('.discountList').remove();

  for(var codeID in this.list){
    var code = this.list[codeID];
    $('#discountManagementList').append(`
      <li class="list-group-item list-group-item-success discountList" id='discount_${codeID}'>
        <input type="checkbox" class="big-checkbox">
          <div class="btn-group" role="group">
            <button class="btn btn-success discountManagementEdit" data-id='${codeID}'><i class="glyphicon glyphicon-edit"></i> Edit</button>
            <button class="btn btn-primary discountManagementCopy"><i class="glyphicon glyphicon-duplicate"></i> Copy</button>
            <button class="btn btn-danger discountManagementDelete"><i class="fa fa-trash"></i> Delete</button>
          </div>
        <span><b>${code.title}</b></span>
      </li>
    `); 
  }
  
  $('.discountManagementEdit').on('click', function(){
    var codeID = $(this).data('id');
    discount.edit(codeID);
  });
} 

discount.edit = function(codeID){
  var code = this.list[codeID];
  this.editing = JSON.parse(JSON.stringify(this.list[codeID]));
  $('#discountBuildSave').data('id', codeID);
  $('#discountBuildTitle').val(code.title);
  $('#discountBuildType_' + code.type).click(); 
  $('.discountBuildValue').val(code.value);
  $('#discountBuildValue_'+code.value).prop('checked', true);
  $('#discountBuildOrderTotal').val(code.orderTotal);
  $('#discountBuildStates').val(code.states);
  $('#discountBuildDate').val(code.date).daterangepicker();

  discount.loadCriteria();
  $('#discountBuild').modal('show');
}
discount.loadCriteria = function(){
  $('.discountBuildCriteria').remove();

  var criteriaID = -1;
  this.editing.criteria.forEach(function(criteria){
    criteriaID += 1;
    $('#discountBuildCriteriaAccordian').append(`
      <div class="panel panel-default discountBuildCriteria">
        <div class="panel-heading" role="tab" id="discountBuildCriteriaHeading_${criteriaID}">
          <h4 class="panel-title">
            <button class="btn btn-default btn-xs collapsed btn-success" data-toggle="collapse" data-parent="#discountBuildCriteriaAccordian" href="#discountBuildCriteria_${criteriaID}">
              <i class="glyphicon glyphicon-pencil"></i>
            </button>
            <button class="btn btn-default btn-xs collapsed btn-danger" data-toggle="collapse" data-parent="#discountBuildCriteriaAccordian" href="#discountBuildCriteria_${criteriaID}">
              <i class="glyphicon glyphicon-trash"></i>
            </button>
            <small>${criteria.quantity}x ${criteria.name}</small>
          </h4>
        </div>
        <div id="discountBuildCriteria_${criteriaID}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="discountBuildCriteriaHeading_${criteriaID}">
          <div class="panel-body">
            <form class="form-horizontal">
              <div class="form-group">
                <div class="col-sm-9">
                  <input type='text' style="width:100%" class="form-control buildCriteriaElement_${criteriaID}" placeholder="Name this criteria" value="${criteria.name}" name='name'>
                </div>
                <div class="col-sm-3 pull-right">
                  <span class="pull-right"><b>Qty:</b> 
                  <input type="number" class="form-control buildCriteriaElement_${criteriaID}" style="width:60px; display:inline-block" value="${criteria.quantity}" name='quantity'></span>
                </div>
              </div>
              <div class="form-group">
                <label for="inputEmail3" class="col-sm-4 control-label">Manufacturer:</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control buildCriteriaElement_${criteriaID}" placeholder="Manufacturer" value="${criteria.manufacturer == 'undefined' ? '' : criteria.manufacturer}" name='manufacturer'>
                </div>
              </div>
              <div class="form-group">
                <label for="inputEmail3" class="col-sm-4 control-label">Category:</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control buildCriteriaElement_${criteriaID}" placeholder="Category" value="${criteria.category == undefined ? '' : criteria.category}" name='category'>
                </div>
              </div>
              <div class="form-group">
                <label for="inputEmail3" class="col-sm-4 control-label">Froogle Label 1:</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control buildCriteriaElement_${criteriaID}" placeholder="Froogle Label" value="${criteria.froogle1 == undefined ? '' : criteria.froogle1}" name='froogle1'>
                </div>
              </div>
              <div class="form-group">
                <label for="inputEmail3" class="col-sm-4 control-label">Froogle Label 2:</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control buildCriteriaElement_${criteriaID}" placeholder="Froogle Label 2" value="${criteria.froogle1 == undefined ? '' : criteria.froogle2}" name='froogle2'>
                </div>
              </div>
              <div class="form-group">
                <label for="inputEmail3" class="col-sm-4 control-label">Specific Item:</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control buildCriteriaElement_${criteriaID}" placeholder="Item ID" value="${criteria.itemList == undefined ? '' : criteria.itemList}" name='itemList'>
                </div>
              </div>
              <div class="form-group">
                <div class="col-sm-12" style="text-align:right">
                  <button class="btn btn-success buildDiscountCriteriaSave" data-criteriaID='${criteriaID}'>Save</button> 
                  <button class="btn" data-toggle="collapse" href="#discountBuildCriteria_${criteriaID}">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    `);
  });
  $('.buildDiscountCriteriaSave').on('click', function(e){
    e.preventDefault();
    discount.buildCriteriaSave($(this).data('criteriaid'));
  });
}
discount.buildCriteriaSave = function(criteriaID){
  var that = this;
  $('.buildCriteriaElement_' + criteriaID).each(function(){
    var key = $(this).attr('name');
    if(this.value !== '') that.editing.criteria[criteriaID][key] = this.value; 
  });

  this.loadCriteria();
}

discount.buildCriteriaAdd = function(){
  var criteriaID = discount.editing.criteria.length;
  var that = this;
  this.editing.criteria[criteriaID] = {};
  $('.discountBuildNewCriteria').each(function(){
    var key = $(this).attr('name');
    if(this.value !== '') that.editing.criteria[criteriaID][key] = this.value;
    if(key !== 'quantity') this.value = ''; 
  });

  this.loadCriteria();
}