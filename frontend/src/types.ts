export interface Policy {
  id: string
  FirstName: string
  LastName: string
  BirthDate: Date
  DrivingExperience: number
  Address: string
  
  TotalPolicy: number
  TotalClaim: number
  ClaimRate: number

  CarId: string
  CarBrand: string
  CarModel: string
  CarYear: number

  Status: "expired" | "active"
  CreateAt: Date

  Premium: number
  newPremium: number
}