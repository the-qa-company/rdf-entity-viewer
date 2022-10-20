import { Link } from '@mui/material'
import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  href: string
  label?: string
}

const DefaultLink = (props: Props): JSX.Element => {
  const { href, children } = props
  return <Link href={href} target='_blank' rel='noreferrer'>{children}</Link>
}

export default DefaultLink
