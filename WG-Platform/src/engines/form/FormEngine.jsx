import { Fragment } from 'react';
import { FORM, platformLog } from '../../debug/index.js';
import { getInputComponent, inputRegistry } from '../../registry/inputRegistry.js';
import { useFormEngine } from './useFormEngine.js';

export function FormEngine({
  schema = [],
  adapter = 'mui',
  registry = inputRegistry,
  components = {},
  value,
  defaultValue,
  onChange,
  onSubmit,
  validation,
  resolver,
  valueMapper,
  renderField,
  actions,
  disabled = false,
  readOnly = false,
  className = '',
  formProps = {}
}) {
  const engine = useFormEngine({
    schema,
    value,
    defaultValue,
    onChange,
    onSubmit,
    validation,
    resolver,
    valueMapper
  });

  platformLog(FORM, 'Form render', {
    adapter,
    fieldCount: schema.length,
    controlled: value !== undefined
  });

  return (
    <form
      {...formProps}
      className={className}
      noValidate={formProps.noValidate ?? true}
      onSubmit={engine.handleSubmit}
    >
      {schema.map((field) => {
        if (!field?.name || field.hidden) {
          return null;
        }

        const Component =
          components[field.name] ||
          field.component ||
          getInputComponent({
            adapter: field.adapter || adapter,
            type: field.type || 'text',
            registry
          });

        if (!Component) {
          platformLog(FORM, 'Field component missing', {
            name: field.name,
            type: field.type || 'text',
            adapter: field.adapter || adapter
          });
          return null;
        }

        const fieldProps = {
          field,
          disabled: disabled || Boolean(field.disabled),
          readOnly: readOnly || Boolean(field.readOnly),
          ...engine.getFieldProps(field)
        };

        if (typeof renderField === 'function') {
          return (
            <Fragment key={field.name}>
              {renderField(fieldProps, engine)}
            </Fragment>
          );
        }

        return <Component key={field.name} {...fieldProps} />;
      })}

      {actions}
    </form>
  );
}
