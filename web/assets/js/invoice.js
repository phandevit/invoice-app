var InvoiceApp = (function() {
	var s; // for settings
	
	return {
		settings: {
			invoiceForm: $('#invoice-form'),
			numRows: 1,
			dataRow: $('#data-row'),
			dataRowHTML: $('#data-row').html(),
		},

		init: function() {
			s = this.settings;
			this.bindActions();
		},

		bindActions: function() {
			s.invoiceForm.validator().on('submit', function(e) {
				if (!e.isDefaultPrevented()) {
					e.preventDefault();
					InvoiceApp.savePDF('#pdf-content');
				}
			});
			$('#add-row').on('click', function(e) {
				e.preventDefault();
				InvoiceApp.addRow();
				s.invoiceForm.validator('update');
			});
			s.dataRow.on('click', '.remove-row', function(e) {
				e.preventDefault();
				InvoiceApp.removeRow($(this));
				s.invoiceForm.validator('update');
			});
			s.invoiceForm.on('blur keyup change', '.userinput', function(e) {
				InvoiceApp.calculateTotal();
			});
		},

		/**
		 * Save to PDF or open PDF in new window
		 */
		savePDF: function(el) {
			var doc = new jsPDF();
			doc.addHTML($(el)[0], 15, 15, {
				'background' : '#fff',
			}, function() {
				//doc.save('Invoice-{{ date }}.pdf'); // save
				doc.output('dataurlnewwindow'); // new window
			});
		},

		/**
		 * Add a new row in invoice table
		 */
		addRow: function() {
			s.dataRow.append(s.dataRowHTML);
			s.numRows++;
		},

		/**
		 * Remove a row from invoice table
		 */
		removeRow: function(el) {
			if (s.numRows != 1) {
				el.closest('tr').remove();
				s.numRows--;
				this.calculateTotal();
			}
		},

		/**
		 * Calculate different totals
		 * For brevity, pure calculation and no currency format
		 */
		calculateTotal: function() {
			var subtotal = 0;
			var tax = Number($('#invoice-tax').val() / 100);
			var total = 0;

			// per row total and subtotal
			$('.row-total').each(function() {
				var rowTotal = $(this).val();
				var rate = Number($(this).closest('tr').find('.row-rate').val());
				var hours = Number($(this).closest('tr').find('.row-hours').val());
				$(this).val(Number(rate*hours));
				subtotal += Number(rowTotal);
			});
			
			// total
			total = Number(subtotal + (subtotal*tax));

			$('#invoice-subtotal').val(subtotal);
			$('#invoice-total').val(total);
		},
	};
})();