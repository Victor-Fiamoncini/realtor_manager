import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import { registerPlugin } from 'filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { Edit, Plus, X } from 'lucide-react'
import React from 'react'
import { FilePond } from 'react-filepond'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

export const CustomFormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  options,
  className,
  inputClassName,
  labelClassName,
  disabled = false,
  isIcon = false,
  initialValue,
}) => {
  const { control } = useFormContext()

  const renderFormControl = (field) => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea className={`border-gray-200 p-4 ${inputClassName}`} placeholder={placeholder} {...field} rows={3} />
        )

      case 'select':
        return (
          <Select
            value={field.value || initialValue}
            defaultValue={field.value || initialValue}
            onValueChange={field.onChange}
          >
            <SelectTrigger className={`w-full border-gray-200 p-4 ${inputClassName}`}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent className="w-full border-gray-200 shadow">
              {options?.map((option) => (
                <SelectItem key={option.value} className="cursor-pointer" value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'switch': {
        return (
          <div className="flex items-center space-x-2">
            <Switch id={name} className={inputClassName} checked={field.value} onCheckedChange={field.onChange} />

            <FormLabel className={labelClassName} htmlFor={name}>
              {label}
            </FormLabel>
          </div>
        )
      }

      case 'file': {
        return (
          <FilePond
            className={inputClassName}
            onupdatefiles={(fileItems) => {
              const files = fileItems.map((fileItem) => fileItem.file)

              field.onChange(files)
            }}
            allowMultiple={true}
            labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
            credits={false}
          />
        )
      }

      case 'number': {
        return (
          <Input
            type="number"
            placeholder={placeholder}
            {...field}
            className={`border-gray-200 p-4 ${inputClassName}`}
            disabled={disabled}
          />
        )
      }

      case 'multi-input': {
        return (
          <MultiInputField name={name} control={control} placeholder={placeholder} inputClassName={inputClassName} />
        )
      }

      default: {
        return (
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            className={`border-gray-200 p-4 ${inputClassName}`}
            disabled={disabled}
          />
        )
      }
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={initialValue}
      render={({ field }) => (
        <FormItem className={`${type !== 'switch' && 'rounded-md'} relative ${className}`}>
          {type !== 'switch' && (
            <div className="flex items-center justify-between">
              <FormLabel className={`text-sm ${labelClassName}`}>{label}</FormLabel>

              {!disabled && isIcon && type !== 'file' && type !== 'multi-input' && (
                <Edit className="text-customgreys-dirtyGrey size-4" />
              )}
            </div>
          )}

          <FormControl>
            {renderFormControl({
              ...field,
              value: field.value !== undefined ? field.value : initialValue,
            })}
          </FormControl>

          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}

const MultiInputField = ({ name, control, placeholder, inputClassName }) => {
  const { fields, append, remove } = useFieldArray({ control, name })

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2">
          <FormField
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormControl>
                <Input
                  {...field}
                  className={`bg-customgreys-darkGrey flex-1 border-none p-4 ${inputClassName}`}
                  placeholder={placeholder}
                />
              </FormControl>
            )}
          />

          <Button
            className="text-customgreys-dirtyGrey"
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => remove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        className="text-customgreys-dirtyGrey mt-2"
        variant="outline"
        size="sm"
        type="button"
        onClick={() => append('')}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  )
}
