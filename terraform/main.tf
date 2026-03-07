data "aws_ami" "ubuntu" {
  most_recent = true

  owners = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "tourism_server" {

  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"   # Free-tier safe

  key_name = aws_key_pair.generated_key.key_name

  vpc_security_group_ids = [
    aws_security_group.tourism_sg.id
  ]

  user_data = <<EOF
#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

sleep 30

apt-get update -y

# Install required software
apt-get install -y git docker.io python3 python3-pip mysql-server docker-compose-plugin

# Start Docker
systemctl start docker
systemctl enable docker

# Allow ubuntu user to run docker
usermod -aG docker ubuntu

# Install Flask
pip3 install --break-system-packages flask

# Start MySQL
systemctl start mysql
systemctl enable mysql

EOF

  tags = {
    Name = "tourism-ubuntu-server"
  }
}