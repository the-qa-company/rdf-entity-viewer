import { Link } from '@mui/material'

interface Props {
  href: string
  children: string
}

const DefaultLink = (props: Props): JSX.Element => {
  const { href, children } = props
  return <Link href={href}>{children}</Link>
}

export default DefaultLink
