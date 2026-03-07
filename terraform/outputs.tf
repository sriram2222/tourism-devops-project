output "public_ip" {
  value = aws_instance.tourism_server.public_ip
}

output "ssh_command" {
  value = "ssh -i tourism-key.pem ubuntu@${aws_instance.tourism_server.public_ip}"
}