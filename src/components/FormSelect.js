var React = require('react/addons');
var blacklist = require('blacklist');
var classNames = require('classnames');

module.exports = React.createClass({
	displayName: 'FormSelect',
	propTypes: {
		alwaysValidate: React.PropTypes.bool,
		className: React.PropTypes.string,
		firstOption: React.PropTypes.string,
		htmlFor: React.PropTypes.string,
		id: React.PropTypes.string,
		label: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		options: React.PropTypes.array.isRequired,
		prependEmptyOption: React.PropTypes.bool,
		required: React.PropTypes.bool,
		requiredMessage: React.PropTypes.string,
		value: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			requiredMessage: 'This field is required'
		};
	},
	getInitialState() {
		return {
			isValid: true,
			validationIsActive: this.props.alwaysValidate
		};
	},
	componentDidMount() {
		if (this.state.validationIsActive) {
			this.validateInput(this.props.value);
		}
	},
	componentWillReceiveProps(newProps) {
		if (this.state.validationIsActive) {
			if (newProps.value !== this.props.value && newProps.value !== this._lastChangeValue && !newProps.alwaysValidate) {
				// reset validation state if the value was changed outside the component
				return this.setState({
					isValid: true,
					validationIsActive: false
				});
			}
			this.validateInput(newProps.value);
		}
	},
	handleChange(e) {
		this._lastChangeValue = e.target.value;
		if (this.props.onChange) this.props.onChange(e.target.value);
	},
	handleBlur() {
		if (!this.props.alwaysValidate) {
			this.setState({ validationIsActive: false });
		}
		this.validateInput(this.props.value);
	},
	validateInput(value) {
		var newState = {
			isValid: true
		};
		if (this.props.required && (!value || (value && !value.length))) {
			newState.isValid = false;
		}
		if (!newState.isValid) {
			newState.validationIsActive = true;
		}
		this.setState(newState);
	},
	render() {
		// props
		var props = blacklist(this.props, 'prependEmptyOption', 'firstOption', 'alwaysValidate', 'htmlFor', 'id', 'label', 'onChange', 'options', 'required', 'requiredMessage', 'value', 'className');

		// classes
		var componentClass = classNames('form-field', {
			'is-invalid': !this.state.isValid
		}, this.props.className);

		// validation message
		var validationMessage;
		if (!this.state.isValid) {
			validationMessage = (
				<div className="form-validation is-invalid">{this.props.requiredMessage}</div>
			);
		}

		// dynamic elements
		var forAndID = this.props.htmlFor || this.props.id;
		var componentLabel = this.props.label ? <label className="form-label" htmlFor={forAndID}>{this.props.label}</label> : null;

		// options
		var options = this.props.options.map(function(opt, i) {
			return ( <option key={'option-' + i} value={opt.value}>{opt.label}</option> );
		});
		if (this.props.prependEmptyOption || this.props.firstOption) {
			options.unshift( <option key="option-blank" value="">{this.props.firstOption ? this.props.firstOption : 'Select...'}</option> );
		}

		return (
			<div className={componentClass}>
				{componentLabel}
				<select className="FormInput" id={forAndID} onChange={this.handleChange} onBlur={this.handleBlur} {...props}>
					{options}
				</select>
				{validationMessage}
			</div>
		);
	}
});
