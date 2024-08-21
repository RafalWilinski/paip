class Paip < Formula
  desc "A CLI that uses an AI to retry failed pip commands based on the output"
  homepage "https://rwilinski.ai"
  version "0.0.3"

  if Hardware::CPU.arm?
    url "https://github.com/RafalWilinski/paip/releases/download/v0.0.1/paip-macos-arm64"
    sha256 "a17e0d756765cfdc354f5fc4708c0c4e3e10ddb67c39bb1eecb7f9024535b1d4" 
  else
    url "https://github.com/RafalWilinski/paip/releases/download/v0.0.1/paip-macos-x64"
    sha256 "8969c09983b68aac93fc50a8adbfe81f15dc19f4be87dee53176a431a7243549"
  end

  def install
    bin.install "paip-macos-#{Hardware::CPU.arm? ? "arm64" : "x64"}" => "paip"
  end

  test do
    system "#{bin}/paip", "--version"
  end
end