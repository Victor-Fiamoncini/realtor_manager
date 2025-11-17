import { clsx } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatEnumString(str) {
  return str.replace(/([A-Z])/g, ' $1').trim()
}

export function formatPriceValue(value, isMin) {
  if (value === null || value === 0) return isMin ? 'Any Min Price' : 'Any Max Price'

  if (value >= 1000) {
    const kValue = value / 1000

    return isMin ? `$${kValue}k+` : `<$${kValue}k`
  }

  return isMin ? `$${value}+` : `<$${value}`
}

export function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== 'any' &&
        value !== '' &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null)
    )
  )
}

export const withToast = async (mutationFn, messages) => {
  const { success, error } = messages

  try {
    const result = await mutationFn

    if (success) toast.success(success)

    return result
  } catch (err) {
    if (error) toast.error(error)

    throw err
  }
}

export const createNewUserInDatabase = async (user, idToken, userRole, fetchWithBQ) => {
  const createEndpoint = userRole?.toLowerCase() === 'manager' ? '/managers' : '/tenants'

  const createUserResponse = await fetchWithBQ({
    url: createEndpoint,
    method: 'POST',
    body: {
      cognitoId: user.userId,
      name: user.username,
      email: idToken?.payload?.email || '',
      phoneNumber: '',
    },
  })

  if (createUserResponse.error) {
    throw new Error('Failed to create user record')
  }

  return createUserResponse
}
