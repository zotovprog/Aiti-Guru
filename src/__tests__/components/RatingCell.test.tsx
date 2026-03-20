import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RatingCell } from '@/components/products/RatingCell'

describe('RatingCell', () => {
  it('should display rating value', () => {
    render(<RatingCell value={4.5} />)
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })

  it('should apply red color when rating is below 3.5', () => {
    render(<RatingCell value={3.2} />)
    const element = screen.getByText('3.2')
    expect(element.style.color).toBe('red')
  })

  it('should NOT apply red color when rating is 3.5 or above', () => {
    render(<RatingCell value={3.5} />)
    const element = screen.getByText('3.5')
    expect(element.style.color).not.toBe('red')
  })

  it('should apply red color when rating is exactly 3.4', () => {
    render(<RatingCell value={3.4} />)
    const element = screen.getByText('3.4')
    expect(element.style.color).toBe('red')
  })
})
