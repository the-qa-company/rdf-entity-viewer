import { Link } from '@mui/material'

interface Props {
  href: string
  children: string
}

const DefaultLink = (props: Props): JSX.Element => {
  const { href, children } = props
  return <Link href={href} target='_blank' rel='noreferrer'>{children}</Link>
}

export default DefaultLink
