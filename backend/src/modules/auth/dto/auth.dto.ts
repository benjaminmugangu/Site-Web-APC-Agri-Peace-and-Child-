import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est requis" })
  email!: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password!: string;
}

export class RegisterDto {
  @IsNotEmpty({ message: 'Le prénom est requis' })
  firstName!: string;

  @IsNotEmpty({ message: 'Le nom est requis' })
  lastName!: string;

  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est requis" })
  email!: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères' })
  password!: string;
}
